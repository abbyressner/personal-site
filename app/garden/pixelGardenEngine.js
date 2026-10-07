/* Pixel Garden — a tiny, dependency-free canvas engine for the pixel-art header on /garden.
   Every art pixel is one canvas pixel, scaled up with image-rendering: pixelated, and the
   background stays fully transparent. Click a flower, bush or the tree to water it; click the
   cardinal to make it chirp. Prototyped on the "Pixel Garden Header" design canvas (option B).
   API: mount(canvas, config) -> { set({ wind, butterflies, paused }), destroy() } */

  var C = {
    g0: '#1f4d17', g1: '#2f6b1f', g2: '#3f8a26', g3: '#55a82e', g4: '#74c23f', g5: '#9fd65a', g6: '#c9e35b',
    ol0: '#4a5e14', ol1: '#6f8a1c', ol2: '#9db82a', ol3: '#c6d93a',
    sg0: '#6f8a5a', sg1: '#97ab7c', sg2: '#b4c69a',
    bb0: '#2b6e43', bb1: '#3f9a5a', bb2: '#5cc06a',
    pk0: '#8f1d43', pk1: '#b8285a', pk2: '#d9446f', pk3: '#ee7896', pk4: '#f8aec0', pk5: '#fde0e7',
    bl0: '#a83a6e', bl1: '#d0609a', bl2: '#e98ab8', bl3: '#f5b8d3', bl4: '#fde3ee',
    cr0: '#d7b9c0', cr1: '#efdde1', cr2: '#fbf3f4',
    ye0: '#e08a12', ye1: '#f2b51c', ye2: '#fbd535', ye3: '#fff08a',
    pu0: '#3e1f78', pu1: '#5b2fa0', pu2: '#8457cf', pu3: '#b591ec', pu4: '#ddc9fb',
    w1: '#5aa9e0', w2: '#bfe6fd',
    can0: '#24525a', can1: '#3a8a8c', can2: '#62b8b0', can3: '#b5e6dc',
    tr0: '#3b1d0e', tr1: '#5e2f12', tr2: '#8a4718', tr3: '#a85c22',
    sp0: '#ffd84a', sp1: '#fff4a8', sp2: '#ffffff'
  };

  var PAL = {
    pink: [C.pk1, C.pk2, C.pk3, C.pk4],
    rose: [C.pk0, C.pk1, C.pk2, C.pk3],
    blush: [C.bl1, C.bl2, C.bl3, C.bl4],
    white: [C.cr0, C.cr1, C.cr2, '#ffffff'],
    purple: [C.pu1, C.pu2, C.pu3, C.pu4],
    butter: [C.ye0, C.ye1, C.ye2, C.ye3],
    coral: ['#b9402c', '#e2623c', '#f5996a', '#fcc9a6']
  };

  var BF_PAL = [
    { o: '#c08a2e', y: '#f3cf63', Y: '#fff1b0', B: '#5e4219' },
    { o: '#c9849d', y: '#f8c9d8', Y: '#fff0f5', B: '#5e3a46' },
    { o: '#7d5bb8', y: '#c3a6f0', Y: '#efe4ff', B: '#3a2a5a' }
  ];

  // ---------- color + sprite helpers ----------
  var packCache = {};
  function pack(hex) {
    var v = packCache[hex];
    if (v !== undefined) return v;
    var n = parseInt(hex.slice(1), 16);
    v = ((255 << 24) | ((n & 255) << 16) | (((n >> 8) & 255) << 8) | ((n >> 16) & 255)) >>> 0;
    packCache[hex] = v;
    return v;
  }
  function gen(w, h, fn) {
    var px = new Uint32Array(w * h);
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var c = fn(x, y);
      if (c) px[y * w + x] = pack(c);
    }
    return { w: w, h: h, px: px };
  }
  function rows(list, map) {
    var h = list.length, w = 0, i;
    for (i = 0; i < h; i++) w = Math.max(w, list[i].length);
    return gen(w, h, function (x, y) { var ch = list[y][x]; return ch && map[ch] ? map[ch] : null; });
  }
  function flip(s) {
    var px = new Uint32Array(s.w * s.h);
    for (var y = 0; y < s.h; y++) for (var x = 0; x < s.w; x++) px[y * s.w + x] = s.px[y * s.w + (s.w - 1 - x)];
    return { w: s.w, h: s.h, px: px };
  }
  function rotate(s, deg) {
    var a = deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    var cx = (s.w - 1) / 2, cy = (s.h - 1) / 2;
    var R = Math.ceil(Math.sqrt(s.w * s.w + s.h * s.h) / 2) + 1, S = R * 2 + 1;
    var px = new Uint32Array(S * S);
    for (var y = 0; y < S; y++) for (var x = 0; x < S; x++) {
      var dx = x - R, dy = y - R;
      var sx = Math.round(cx + dx * ca + dy * sa), sy = Math.round(cy - dx * sa + dy * ca);
      if (sx >= 0 && sy >= 0 && sx < s.w && sy < s.h) px[y * S + x] = s.px[sy * s.w + sx];
    }
    return { w: S, h: S, px: px, R: R };
  }
  function hash(x, y, s) {
    var h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 2147483647);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------- flower heads ----------
  function genRadial(R, petals, pal, center) {
    var S = R * 2 + 1, rot = center.rot || 0;
    return gen(S, S, function (x, y) {
      var dx = x - R, dy = y - R, d = Math.sqrt(dx * dx + dy * dy);
      var k = Math.abs(Math.cos((Math.atan2(dy, dx) + rot) * petals / 2));
      var edge = R * (0.58 + 0.42 * Math.pow(k, 0.7)) + 0.45;
      if (d > edge) return null;
      if (d <= center.r) {
        var l = -(dx + dy);
        return l > 0.5 ? center.c[2] : (l < -0.5 ? center.c[0] : center.c[1]);
      }
      if (R >= 4) {
        if (d <= center.r + 0.9) return pal[0];
        if (d > edge - 0.9) return pal[0];
        if (k < 0.16 && petals <= 8) return pal[0];
      }
      var v = 0.55 * (d / R) + 0.9 * (-(dx + dy) / (2 * R));
      return v > 0.75 ? pal[3] : v > 0.42 ? pal[2] : pal[1];
    });
  }
  function genDaffodil(R) {
    var W = Math.ceil(R * 2.35) + 2, H = R * 2 + 1;
    var tcx = R + R * 0.95, tr = R * 0.62;
    var petals = genRadial(R, 6, PAL.white, { r: 0, c: [C.cr0, C.cr0, C.cr0], rot: 0.5 });
    return gen(W, H, function (x, y) {
      var dy = y - R;
      // flared mouth
      var mx = (x - tcx) / Math.max(1, tr * 0.5), my = dy / (tr * 1.1);
      var md = mx * mx + my * my;
      if (md <= 1.05) {
        var imx = (x - tcx - 0.4) / Math.max(1, tr * 0.32), imy = dy / (tr * 0.65);
        if (imx * imx + imy * imy <= 1) return C.ye0;
        return dy < 0 ? C.ye3 : C.ye2;
      }
      // tube
      if (x >= R - 1 && x <= tcx) {
        var half = tr * (0.72 + 0.28 * (x - R) / (tcx - R));
        if (Math.abs(dy) <= half) {
          if (dy > half - 1) return C.ye0;
          return dy < -half * 0.35 ? C.ye3 : (dy > half * 0.35 ? C.ye1 : C.ye2);
        }
      }
      if (x < petals.w && y < petals.h) {
        var c = petals.px[y * petals.w + x];
        if (c) return '#' + ('000000' + (((c & 255) << 16) | (c & 0xff00) | ((c >> 16) & 255)).toString(16)).slice(-6);
      }
      return null;
    });
  }
  var TULIP = [
    '.b.c.b.',
    'abbcbba',
    'abbccba',
    'abbccda',
    'abbccba',
    'aabbcaa',
    '.aabba.',
    '..aaa..'
  ];
  var BUD = ['.c.', 'bcd', 'abc', '.g.'];
  var BELL = ['.bb.', 'abbc', 'abbc', 'abcc', 'a..d'];
  var BELL_S = ['.b.', 'abc', 'a.d'];
  var TULIP_S = ['b.c.b', 'abbca', 'abbca', 'aabaa', '.aaa.'];
  var MINI_DAISY = ['.w.', 'wyw', '.w.'];

  var BF_OPEN = ['...B.B...', 'oo..B..oo', 'oYyoBoyYo', 'oYyyByyYo', '.oyyByyo.', '.oyyByyo.', 'oyyoBoyyo', '.oo...oo.'];
  var BF_HALF = ['..B.B..', 'o..B..o', 'oYoBoYo', 'oYyByYo', '.oyByo.', '.oyByo.', 'oyoBoyo', '.o...o.'];
  var BF_SHUT = ['.B.B.', '..B..', '.oBo.', '.YBY.', '.yBy.', '.yBy.', '.oBo.', '.....'];

  var CAN = [
    '...kkkkk.........',
    '..k.....k........',
    '..k.....k.....kkk',
    '.kkkkkkkkk...ktlk',
    '.khlttttttk.ktkk.',
    '.khtttttttkktk...',
    '.klttttttttkk....',
    '.kltttttttttk....',
    '.ktttttttttk.....',
    '.kttttttttk......',
    '..kkkkkkkk.......'
  ];
  var CAN_MAP = { k: C.can0, t: C.can1, l: C.can2, h: C.can3 };
  var CAN_ANGLES = [0, 12, 24, 36];

  function buildCanFrames(dir) {
    var base = rows(CAN, CAN_MAP);
    if (dir < 0) base = flip(base);
    var tip = { x: dir > 0 ? 16 : 0, y: 4 };
    var cx = (base.w - 1) / 2, cy = (base.h - 1) / 2;
    return CAN_ANGLES.map(function (deg) {
      var r = rotate(base, deg * dir), a = deg * dir * Math.PI / 180;
      var dx = tip.x - cx, dy = tip.y - cy;
      r.tip = { x: dx * Math.cos(a) - dy * Math.sin(a), y: dx * Math.sin(a) + dy * Math.cos(a) };
      return r;
    });
  }

  // ---------- cherry tree ----------
  function genTree() {
    var W = 72, H = 74, trunk = new Uint32Array(W * H), canopy = new Uint32Array(W * H), cpx = [];
    function tp(x, y, c) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < W && y < H) trunk[y * W + x] = pack(c); }
    function limb(x0, y0, x1, y1, w0, w1) {
      var n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))) * 2;
      for (var i = 0; i <= n; i++) {
        var f = i / n, x = x0 + (x1 - x0) * f, y = y0 + (y1 - y0) * f, w = Math.max(1, Math.round(w0 + (w1 - w0) * f));
        var sx = Math.round(x) - Math.floor(w / 2);
        for (var o = 0; o < w; o++) tp(sx + o, y, w === 1 ? C.tr1 : (o === 0 ? C.tr3 : (o === w - 1 ? C.tr0 : (o === 1 ? C.tr2 : C.tr1))));
      }
    }
    limb(44, 73, 42, 62, 5, 4); limb(42, 62, 39, 52, 4, 3); limb(39, 52, 37, 44, 3, 3);
    limb(37, 44, 28, 33, 2, 1); limb(37, 44, 46, 32, 2, 1); limb(38, 48, 52, 40, 2, 1);
    limb(37, 44, 36, 28, 2, 1); limb(39, 52, 24, 42, 2, 1);
    tp(40, 73, C.tr2); tp(41, 73, C.tr1); tp(47, 73, C.tr1); tp(48, 73, C.tr0);
    var blobs = [[28, 30, 12], [38, 20, 13], [50, 26, 12], [22, 40, 9], [56, 37, 9], [40, 34, 12], [31, 22, 8]];
    var ramp = [C.bl0, C.bl1, C.bl2, C.bl3, C.bl4];
    var box = { x0: W, y0: H, x1: 0, y1: 0 };
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var m = 9;
      for (var b = 0; b < blobs.length; b++) {
        var B = blobs[b], d = Math.sqrt((x - B[0]) * (x - B[0]) + (y - B[1]) * (y - B[1]));
        m = Math.min(m, d / (B[2] + (hash(x, y, 3) - 0.5) * 2.6));
      }
      if (m > 1) continue;
      var h3 = hash(x, y, 9);
      if (h3 < 0.06 && m > 0.3) continue;
      var n = hash(x >> 1, y >> 1, 5) * 0.6 + hash(x, y, 7) * 0.4;
      var v = 0.2 + (-((x - 38) + (y - 26)) / 60) + (1 - m) * 0.25 + (n - 0.5) * 0.55;
      var col = h3 > 0.992 ? '#ffffff' : ramp[Math.max(0, Math.min(4, Math.floor(v * 5 + 1)))];
      canopy[y * W + x] = pack(col);
      cpx.push(x, y);
      if (x < box.x0) box.x0 = x; if (y < box.y0) box.y0 = y; if (x > box.x1) box.x1 = x; if (y > box.y1) box.y1 = y;
    }
    return { trunk: { w: W, h: H, px: trunk }, canopy: { w: W, h: H, px: canopy }, cpx: cpx, box: box, baseX: 44, baseY: 73 };
  }

  function packA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return (((a & 255) << 24) | ((n & 255) << 16) | (((n >> 8) & 255) << 8) | ((n >> 16) & 255)) >>> 0;
  }

  // ---------- japanese cherry / bonsai: recursive, wide-spreading limbs with cloud pads ----------
  function buildBonsai(seed, sc) {
    var r = rng(seed), segs = [], blobs = [];
    function grow(x, y, ang, len, w, depth) {
      var steps = Math.max(2, Math.ceil(len * 2)), bend = (r() - 0.5) * (depth >= 4 ? 1.0 : 0.7);
      var w1 = Math.max(1, w * 0.62), a = ang;
      for (var i = 0; i < steps; i++) {
        var f = i / steps;
        a = ang + bend * f;
        x += Math.cos(a) * 0.5; y += Math.sin(a) * 0.5;
        segs.push(x, y, w + (w1 - w) * f);
        if (depth <= 2 && i === Math.floor(steps * 0.6) && r() < 0.55) blobs.push(x, y, (2.5 + r() * 2) * sc);
      }
      if (depth === 0 || len < 3) { blobs.push(x, y, (4 + r() * 3) * sc); return; }
      var n = depth >= 4 ? 2 : (r() < 0.35 ? 3 : 2);
      for (var k = 0; k < n; k++) {
        var side = k === 2 ? (r() - 0.5) : (k === 0 ? -1 : 1);
        var spread = (0.45 + r() * 0.45) * side * (depth === 5 ? 1.25 : 1);
        var ca = a + spread;
        if (depth <= 4) ca = ca * 0.72 + (ca < -Math.PI / 2 ? -Math.PI + 0.22 : -0.22) * 0.28;
        ca = Math.max(-Math.PI + 0.12, Math.min(-0.12, ca));
        grow(x, y, ca, len * (0.62 + r() * 0.2), w1, depth - 1);
      }
    }
    grow(0, 0, -Math.PI / 2 + 0.18, 20 * sc, 8, 5);
    var minX = 0, maxX = 0, minY = 0, maxY = 0, i;
    for (i = 0; i < segs.length; i += 3) { minX = Math.min(minX, segs[i] - 4); maxX = Math.max(maxX, segs[i] + 4); minY = Math.min(minY, segs[i + 1]); }
    for (i = 0; i < blobs.length; i += 3) { minX = Math.min(minX, blobs[i] - blobs[i + 2] - 2); maxX = Math.max(maxX, blobs[i] + blobs[i + 2] + 2); minY = Math.min(minY, blobs[i + 1] - blobs[i + 2] - 2); }
    return { segs: segs, blobs: blobs, minX: minX, maxX: maxX, minY: minY, maxY: maxY };
  }
  function genBonsai(seed, maxH, maxW, birdSide) {
    var sc = 1, b;
    for (var tries = 0; tries < 5; tries++) {
      b = buildBonsai(seed, sc);
      var bh = b.maxY - b.minY + 2, bw = b.maxX - b.minX + 2;
      var f = Math.min(maxH / bh, maxW / bw);
      if (Math.abs(f - 1) < 0.01) break;
      sc *= f;
    }
    var W = Math.ceil(b.maxX - b.minX) + 4, H = Math.ceil(b.maxY - b.minY) + 3;
    var ox = -b.minX + 2, oy = -b.minY + 1;
    var trunk = new Uint32Array(W * H), canopy = new Uint32Array(W * H), cpx = [], i, x, y;
    function tp(x, y, c) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < W && y < H) trunk[y * W + x] = pack(c); }
    for (i = 0; i < b.segs.length; i += 3) {
      var wi = Math.max(1, Math.round(b.segs[i + 2])), sx = Math.round(b.segs[i] + ox) - Math.floor(wi / 2), sy = b.segs[i + 1] + oy;
      for (var o = 0; o < wi; o++) tp(sx + o, sy, wi === 1 ? C.tr1 : (o === 0 ? C.tr3 : (o === wi - 1 ? C.tr0 : (o === 1 ? C.tr2 : C.tr1))));
    }
    var bx = Math.round(ox), by = Math.round(oy);
    for (i = -6; i <= 6; i++) { if (Math.abs(i) > 3) tp(bx + i, by - 1 + (Math.abs(i) > 5 ? 1 : 0), i < 0 ? C.tr2 : C.tr0); }
    var ramp = [C.bl0, C.bl1, C.bl2, C.bl3, C.bl4];
    for (i = 0; i < b.blobs.length; i += 3) {
      var cx = b.blobs[i] + ox, cy = b.blobs[i + 1] + oy, rr = b.blobs[i + 2];
      for (y = Math.floor(cy - rr - 2); y <= Math.ceil(cy + rr + 2); y++) for (x = Math.floor(cx - rr - 3); x <= Math.ceil(cx + rr + 3); x++) {
        if (x < 0 || y < 0 || x >= W || y >= H) continue;
        var dx = x - cx, dy = (y - cy) * 1.35, d = Math.sqrt(dx * dx + dy * dy);
        if (d > rr + (hash(x, y, 3) - 0.5) * 2.2) continue;
        var h3 = hash(x, y, 9);
        if (h3 < 0.07) continue;
        var nz = hash(x >> 1, y >> 1, 5) * 0.6 + hash(x, y, 7) * 0.4;
        var v = 0.42 - dx / rr * 0.2 - (y - cy) / rr * 0.42 + (nz - 0.5) * 0.5 - (x - W / 2) / W * 0.15;
        canopy[y * W + x] = pack(h3 > 0.993 ? '#ffffff' : ramp[Math.max(0, Math.min(4, Math.floor(v * 5)))]);
      }
    }
    var box = { x0: W, y0: H, x1: 0, y1: 0 };
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) if (canopy[y * W + x]) {
      cpx.push(x, y);
      if (x < box.x0) box.x0 = x; if (y < box.y0) box.y0 = y; if (x > box.x1) box.x1 = x; if (y > box.y1) box.y1 = y;
    }
    // a visible spot on a thin branch for a perched bird: few blossoms above it, mid-height or higher
    var perch = null, bestScore = 1e9;
    if (birdSide === 'right') {
      // a short bare twig off the right of the trunk, below the blossoms, so the bird sits in the open
      var tpts = [];
      for (i = 0; i < b.segs.length; i += 3) if (b.segs[i + 2] > 5) tpts.push(i);
      var ti = tpts[Math.floor(tpts.length * 0.62)];
      var tx0 = b.segs[ti] + ox, ty0 = b.segs[ti + 1] + oy, len = Math.min(26, box.x1 - 4 - tx0);
      var ex = tx0, ey = ty0;
      for (var q = 0; q <= len * 2; q++) {
        var fq = q / (len * 2);
        ex = tx0 + fq * len; ey = ty0 - fq * len * 0.32 - Math.sin(fq * Math.PI) * 1.5;
        tp(ex, ey, fq < 0.4 ? C.tr1 : C.tr2);
        if (fq < 0.35) tp(ex, ey + 1, C.tr0);
      }
      tp(ex + 1, ey - 1, C.tr2); tp(ex - 3, ey - 1, C.tr2); tp(ex - 3, ey - 2, C.tr2);
      perch = { x: Math.round(tx0 + len * 0.68), y: Math.round(ty0 - len * 0.68 * 0.32 - Math.sin(0.68 * Math.PI) * 1.5) };
      // clear blossoms from the bird's spot so it reads against the background
      for (y = perch.y - 11; y < perch.y; y++) for (x = perch.x - 7; x <= perch.x + 5; x++) if (x >= 0 && y >= 0 && x < W) canopy[y * W + x] = 0;
    }
    for (i = 0; i < b.segs.length && !perch; i += 3) {
      var px0 = Math.round(b.segs[i] + ox), py0 = Math.round(b.segs[i + 1] + oy), sw = b.segs[i + 2];
      if (sw > 3.2 || sw < 1.2 || py0 > H * 0.62 || py0 < H * 0.2 || px0 < 8 || px0 > W - 8) continue;
      if (canopy[py0 * W + px0]) continue;
      var cnt = 0;
      for (y = py0 - 10; y < py0; y++) for (x = px0 - 5; x <= px0 + 5; x++) if (x >= 0 && y >= 0 && x < W && canopy[y * W + x]) cnt++;
      var score = cnt + Math.abs(px0 - W * 0.45) * 0.4;
      if (score < bestScore) { bestScore = score; perch = { x: px0, y: py0 - Math.floor(sw / 2) }; }
    }
    if (!perch) perch = { x: Math.round(W * 0.45), y: box.y0 + 2 };
    return { trunk: { w: W, h: H, px: trunk }, canopy: { w: W, h: H, px: canopy }, cpx: cpx, box: box, baseX: bx, baseY: by, perch: perch };
  }

  // ---------- cardinal ----------
  var CARDINAL = [
    '.....rr....',
    '....rRr....',
    '...rRRr....',
    '..kkRRr....',
    '.okkkRRr...',
    'oo.kRRRRr..',
    '...rRRRRRr.',
    '...rdRRRRrt',
    '....rddRrtt',
    '.....f.f..t'
  ];
  var CARDINAL_FLICK = [
    '.....rr....',
    '....rRr....',
    '...rRRr....',
    '..kkRRr....',
    '.okkkRRr..t',
    'oo.kRRRRrtt',
    '...rRRRRRt.',
    '...rdRRRRr.',
    '....rddRr..',
    '.....f.f...'
  ];
  var CARDINAL_MAP = { r: '#b5122b', R: '#e0283a', d: '#7d0d1c', k: '#1b1414', o: '#f2a03d', t: '#8f1022', f: '#4a2a1a' };

  // ---------- bushes + clouds ----------
  function genBush(w, h, r, blooms, back) {
    var n = Math.max(2, Math.round(w / 7)), bumps = [], i, x, y;
    for (i = 0; i < n; i++) {
      var t = n === 1 ? 0.5 : i / (n - 1), dome = 1 - Math.abs(2 * t - 1);
      var rr = h * (0.42 + 0.38 * dome) * (0.85 + r() * 0.3);
      bumps.push([2 + (w - 4) * t + (r() - 0.5) * 2, h - rr * (0.9 + 0.5 * dome), rr]);
    }
    var mask = new Uint8Array(w * h);
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      var ex = (x - (w - 1) / 2) / (w / 2), ey = (y - h) / (h * 0.82);
      var inside = ex * ex + ey * ey <= 1;
      for (var k = 0; k < bumps.length && !inside; k++) {
        var B = bumps[k], dd = Math.sqrt((x - B[0]) * (x - B[0]) + (y - B[1]) * (y - B[1]));
        if (dd <= B[2] + (hash(x, y, 13) - 0.5) * 1.2) inside = true;
      }
      if (inside) mask[y * w + x] = 1;
    }
    function m(x, y) { return x >= 0 && y >= 0 && x < w && y < h && mask[y * w + x]; }
    var ramp = back ? ['#163a13', '#1f4d17', '#2b6420', '#3a7f28', '#4f9a32', '#6cb43e'] : [C.g0, C.g1, C.g2, C.g3, C.g4, C.g5];
    var s = gen(w, h, function (x, y) {
      if (!m(x, y)) return null;
      var nx = (x - (w - 1) / 2) / (w / 2), ny = (y - h * 0.45) / (h * 0.6);
      var leaf = hash(x >> 1, (y + (x & 1)) >> 1, 21);
      var v = 0.52 - nx * 0.22 - ny * 0.42 + (leaf - 0.5) * 0.35 + (hash(x, y, 17) - 0.5) * 0.15;
      if (!m(x, y - 1) || !m(x - 1, y)) v += 0.22;           // lit top-left rim
      if (!m(x + 1, y) || !m(x, y + 1) && y < h - 1) v -= 0.3; // shaded bottom-right rim
      if (y >= h - 2) v -= 0.18;                                  // contact shadow
      if (!back && hash(x, y, 19) > 0.975 && y < h * 0.55) return C.g6;
      return ramp[Math.max(0, Math.min(5, Math.floor(v * 6)))];
    });
    s.top = [];
    for (i = 0; i < s.px.length; i++) if (s.px[i] && Math.floor(i / w) < h * 0.6) s.top.push(i);
    for (i = 0; i < (blooms || 0); i++) bushBloom(s, r);
    return s;
  }
  function bushBloom(s, r) {
    if (!s.top.length) return;
    var i = s.top[Math.floor(r() * s.top.length)];
    s.px[i] = pack(r() < 0.5 ? C.pk3 : C.bl3);
    if (i + 1 < s.px.length && s.px[i + 1] && (i + 1) % s.w) s.px[i + 1] = pack(C.pk4);
  }
  function genCloud(w, h, seed) {
    var r = rng(seed), n = Math.max(2, Math.round(w / 8)), bumps = [];
    for (var i = 0; i < n; i++) {
      var rr = h * (0.45 + r() * 0.5) * (i === 0 || i === n - 1 ? 0.75 : 1);
      bumps.push([w * (i + 0.5) / n + (r() - 0.5) * 3, h - 1 - rr * 0.6, rr]);
    }
    var A = 230, c0 = packA('#ffffff', A), c1 = packA('#eef1fb', A), c2 = packA('#d3d9f0', A), c3 = packA('#bcc4e6', A);
    var px = new Uint32Array(w * h);
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var inB = null;
      for (var k = 0; k < bumps.length; k++) {
        var B = bumps[k];
        if ((x - B[0]) * (x - B[0]) + (y - B[1]) * (y - B[1]) <= B[2] * B[2]) { inB = B; break; }
      }
      var base = y >= h - 3 && x >= 2 && x <= w - 3;
      if (!inB && !base) continue;
      var c = c1;
      if (y >= h - 1) c = c3; else if (y >= h - 3) c = c2;
      else if (inB && (x - inB[0]) + (y - inB[1]) < -inB[2] * 0.45) c = c0;
      px[y * w + x] = c;
    }
    return { w: w, h: h, px: px };
  }

  // ---------- engine ----------
  function mount(canvas, cfg) {
    var P = cfg.pixel || 4;
    var gw = Math.round(cfg.width / P), gh = Math.round(cfg.height / P);
    canvas.width = gw; canvas.height = gh;
    var ctx = canvas.getContext('2d');
    var img = ctx.createImageData(gw, gh);
    var buf = new Uint32Array(img.data.buffer);
    var rnd = rng(cfg.seed || 7);
    var groundY = gh - (cfg.groundRows || 3) - 1;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var opts = { wind: cfg.wind == null ? 1 : cfg.wind, butterflies: cfg.butterflies == null ? 2 : cfg.butterflies, paused: !!cfg.paused };
    var T = 0;

    function put(x, y, c) {
      x = Math.round(x); y = Math.round(y);
      if (x < 0 || y < 0 || x >= gw || y >= gh) return;
      buf[y * gw + x] = typeof c === 'number' ? c : pack(c);
    }
    function blit(s, x, y) {
      x = Math.round(x); y = Math.round(y);
      for (var j = 0; j < s.h; j++) {
        var yy = y + j; if (yy < 0 || yy >= gh) continue;
        for (var i = 0; i < s.w; i++) {
          var c = s.px[j * s.w + i]; if (!c) continue;
          var xx = x + i; if (xx < 0 || xx >= gw) continue;
          buf[yy * gw + xx] = c;
        }
      }
    }

    // wind: a gentle breeze + occasional gusts rolling left to right
    var gusts = [], nextGust = 2 + rnd() * 3;
    function wind(x, t) {
      var w = (Math.sin(t * 1.1 + x * 0.06) * 0.5 + Math.sin(t * 0.43 + x * 0.017 + 1.3) * 0.4) * 0.8;
      for (var i = 0; i < gusts.length; i++) {
        var g = gusts[i], d = (x - g.pos) / g.width;
        w += g.amp * Math.exp(-d * d);
      }
      return w * opts.wind * (reduce ? 0.3 : 1);
    }

    // grass
    function makeBlades(count, minH, maxH, y0, pal, tips) {
      var a = [];
      for (var i = 0; i < count; i++) {
        var c = Math.floor(rnd() * pal.length);
        a.push({ x: Math.floor(rnd() * gw), y: y0, h: minH + Math.floor(Math.pow(rnd(), 1.5) * (maxH - minH + 1)),
          c: pack(pal[c]), tip: pack(tips[Math.min(tips.length - 1, c)]), lean: (rnd() - 0.5) * 1.4, wide: rnd() < 0.35, dark: pack(pal[0]) });
      }
      return a;
    }
    var gmax = cfg.grassMax || 7;
    var back = makeBlades(Math.round(gw * (cfg.grassBack || 1.2)), 2, gmax - 1, groundY, [C.g1, C.g2, C.g2, C.g3], [C.g3, C.g4, C.g4, C.g5]);
    var front = makeBlades(Math.round(gw * (cfg.grassFront || 1)), 1, gmax, groundY + 1, [C.g2, C.g3, C.g4, C.g4], [C.g4, C.g5, C.g6, C.g6]);
    function drawBlade(b, t) {
      var w = wind(b.x, t) * b.h * 0.22 + b.lean;
      for (var i = 0; i < b.h; i++) {
        var f = (i + 1) / b.h, dx = Math.round(w * f * f);
        put(b.x + dx, b.y - i, i === b.h - 1 && b.h > 2 ? b.tip : b.c);
        if (b.wide && i < b.h * 0.5) put(b.x + dx + 1, b.y - i, b.dark);
      }
    }
    var daisySprite = rows(MINI_DAISY, { w: '#ffffff', y: C.ye2 });
    var daisies = [];
    for (var di = 0; di < (cfg.daisies || 0); di++) daisies.push({ x: Math.floor(rnd() * gw), y: groundY - 1 - Math.floor(rnd() * 3) });

    // plants
    var STAGE_GROW = [0.18, 0.6, 1];
    var plants = [], tree = null;
    var small = !!cfg.smallFlowers;
    (cfg.plants || []).forEach(function (s) { plants.push(makePlant(s)); });
    function layer(p) { return p.k === 'bush' ? (p.back ? 0 : 2) : 1; }
    plants.sort(function (a, b) { return layer(a) - layer(b); });
    function makePlant(s) {
      if (s.k === 'bush') {
        var spr = genBush(s.w || 18, s.h || 9, rnd, s.blooms == null ? 3 : s.blooms, !!s.back);
        return { k: 'bush', back: !!s.back, x: Math.round(s.x * gw), spr: spr, stage: 2, grow: 1, extra: 0, hop: 0, lastWater: -99, watering: false, box: null, perch: null, wpt: null };
      }
      var p = { k: s.k, x: Math.round(s.x * gw), h: s.h || 20, R: s.R || 4, stage: s.stage == null ? 2 : s.stage,
        extra: 0, maxExtra: s.maxExtra == null ? 3 : s.maxExtra, hop: 0, lastWater: -99, watering: false,
        dir: s.dir || 1, curve: s.curve || 0, bells: s.bells || 5, aw: s.aw || 7, box: null, perch: null, wpt: null };
      p.pal = PAL[s.pal || ({ cosmos: 'pink', daisy: 'white', blossom: 'blush', sprig: 'blush', tulip: 'rose', daffodil: 'butter', bluebell: 'purple' })[p.k]];
      p.grow = STAGE_GROW[p.stage];
      var stems = {
        sprig: [C.sg1, C.sg0, C.sg2, C.sg0], daffodil: [C.ol2, C.ol0, C.ol3, C.ol1], bluebell: [C.bb1, C.bb0, C.bb2, C.bb0]
      }[p.k] || [C.g3, C.g1, C.g4, C.g2];
      p.stemC = pack(stems[0]); p.stemD = pack(stems[1]); p.leafL = pack(stems[2]); p.leafD = pack(stems[3]);
      p.thick = p.k === 'daffodil' || (p.k === 'cosmos' && p.R >= 6);
      var center = { r: Math.max(1.2, p.R * 0.28), c: [C.ye0, C.ye1, C.ye3] };
      if (p.k === 'cosmos') p.head = genRadial(p.R, 8, p.pal, center);
      else if (p.k === 'daisy') p.head = genRadial(p.R, 14, p.pal, { r: Math.max(1.2, p.R * 0.38), c: [C.ye0, C.ye2, C.ye3] });
      else if (p.k === 'sprig' || p.k === 'blossom') {
        p.head = genRadial(p.R, 5, p.pal, { r: 0.8, c: [C.pk2, C.pk2, C.pk3], rot: -0.3 });
        p.mini = genRadial(2, 5, p.pal, { r: 0.6, c: [C.pk2, C.pk2, C.pk2] });
      }
      else if (p.k === 'tulip') p.head = rows(small ? TULIP_S : TULIP, { a: p.pal[0], b: p.pal[1], c: p.pal[2], d: p.pal[3] });
      else if (p.k === 'daffodil') { p.head = genDaffodil(p.R); if (p.dir < 0) p.head = flip(p.head); }
      else if (p.k === 'bluebell') p.bell = rows(small ? BELL_S : BELL, { a: C.pu1, b: C.pu2, c: C.pu3, d: C.pu4 });
      p.bud = rows(BUD, { a: p.pal[0], b: p.pal[1], c: p.pal[2], d: p.pal[3], g: p.k === 'sprig' ? C.sg0 : C.g3 });
      p.leaves = s.leaves || [{ f: 0.3, s: -1, n: p.h > 24 ? 4 : (p.h < 14 ? 2 : 3) }, { f: 0.55, s: 1, n: p.h < 14 ? 2 : 3 }];
      if (p.k === 'daffodil' || p.k === 'bluebell') {
        p.leaves = [];
        p.blades = [{ dx: -1, lean: -3, h: 0.55 }, { dx: 1, lean: 3.5, h: 0.7 }, { dx: 0, lean: -1.5, h: 0.42 }, { dx: 2, lean: 1, h: 0.35 }];
      }
      return p;
    }
    if (cfg.tree) {
      var tg = cfg.tree.style === 'bonsai' ? genBonsai(cfg.tree.seed || 3, groundY + 7 - (cfg.tree.top == null ? 3 : cfg.tree.top), cfg.tree.maxW || 180, cfg.tree.birdSide) : genTree();
      var treeX = cfg.tree.right != null ? gw - 2 - cfg.tree.right - (tg.box.x1 - tg.baseX) : Math.round(cfg.tree.x * gw);
      tree = { k: 'tree', x: treeX, g: tg, hop: 0, lastWater: -99, watering: false, stage: 2, noPerch: true, box: null, wpt: null };
      plants.unshift(tree);
    }

    var bird = null;
    if (tree && cfg.cardinal) {
      bird = { f0: rows(CARDINAL, CARDINAL_MAP), f1: rows(CARDINAL_FLICK, CARDINAL_MAP), hop: 0, flick: 0, next: 2 + rnd() * 3, box: null };
    }
    function chirp() {
      if (bird.hop > 0) return;
      bird.hop = 0.0001;
      var b = bird.box;
      spark(b.x0 - 1, b.y0 + 2, 'note', -6, -10, 1.1);
      spark(b.x0 + 2, b.y0, 'note', -2, -13, 1.3);
    }
    // cfg.cardinal === 'bush': perch on top of the first bush to the right of the trunk instead of a branch
    if (bird && cfg.cardinal === 'bush') {
      bird.bush = plants.filter(function (p) { return p.k === 'bush' && p.x > tree.x; })
        .sort(function (a, b) { return a.x - b.x; })[0] || null;
      if (bird.bush) {
        bird.bush.noPerch = true; // keep butterflies from landing on the cardinal
        var bs = bird.bush.spr, col = Math.floor(bs.w / 2), top = 0;
        while (top < bs.h - 1 && !bs.px[top * bs.w + col]) top++;
        bird.bushTop = top;
      }
    }
    function drawBird() {
      var g = tree.g, s = bird.flick > 0 ? bird.f1 : bird.f0;
      var hop = bird.hop > 0 ? Math.round(Math.sin(bird.hop * Math.PI) * 3) : 0;
      var x = tree.x - g.baseX + g.perch.x - 6, y = groundY - g.baseY + 1 + g.perch.y - s.h - hop;
      if (bird.bush) {
        var bp = bird.bush;
        x = bp.x - Math.floor(bp.spr.w / 2) + Math.floor(bp.spr.w / 2) - 6;
        y = groundY - bp.spr.h + 2 + bird.bushTop - s.h + 1 - hop;
      }
      blit(s, x, y);
      bird.box = { x0: x, y0: y, x1: x + s.w - 1, y1: y + s.h - 1 };
    }
    function drawLeaf(x, y, L, p) {
      for (var j = 1; j <= L.n; j++) {
        var yy = y - Math.round(j * 0.6);
        put(x + L.s * j, yy, p.leafL);
        if (j < L.n) put(x + L.s * j, yy + 1, p.leafD);
      }
    }
    function drawTree(p, t) {
      var g = p.g, bx = p.x - g.baseX, by = groundY - g.baseY + 1;
      blit(g.trunk, bx, by);
      var dx = Math.max(-1, Math.min(1, Math.round(wind(p.x, t) * 0.7)));
      blit(g.canopy, bx + dx, by);
      p.ox = bx + dx; p.oy = by;
      p.box = { x0: bx + g.box.x0, y0: by + g.box.y0, x1: bx + g.box.x1, y1: by + g.box.y1 };
      p.wpt = { x: p.x - 3, y: groundY - 1 };
    }
    function drawPlant(p, t) {
      if (p.k === 'tree') return drawTree(p, t);
      if (p.k === 'bush') {
        var bxx = p.x - Math.floor(p.spr.w / 2), byy = groundY - p.spr.h + 2;
        blit(p.spr, bxx, byy);
        p.box = { x0: bxx, y0: byy, x1: bxx + p.spr.w - 1, y1: byy + p.spr.h - 1 };
        p.perch = { x: p.x + 2, y: byy - 3 };
        p.wpt = { x: p.x, y: byy };
        return;
      }
      var H = Math.max(3, Math.round(p.h * p.grow + p.extra));
      var sway = wind(p.x, t) * H * 0.06;
      var hop = p.hop > 0 ? Math.round(Math.sin(p.hop * Math.PI) * 2) : 0;
      var i, j;
      if (p.blades && p.grow > 0.3) {
        for (i = 0; i < p.blades.length; i++) {
          var bl = p.blades[i], bh = Math.max(2, Math.round(H * bl.h));
          for (j = 0; j < bh; j++) {
            var f0 = (j + 1) / bh;
            put(p.x + bl.dx + Math.round((sway * 0.8 + bl.lean) * f0 * f0), groundY - j, j > bh * 0.6 ? p.leafL : p.leafD);
          }
        }
      }
      var tx = p.x, ty = groundY, sideBox = null;
      for (i = 0; i <= H; i++) {
        var f = i / H;
        var x = p.x + Math.round(sway * f * f + p.curve * Math.sin(f * Math.PI));
        var y = groundY - i;
        put(x, y, (i + p.x) % 4 === 0 ? p.stemD : p.stemC);
        if (p.thick && i < H - 1) put(x + 1, y, p.stemD);
        if (p.grow > 0.5) for (j = 0; j < p.leaves.length; j++) if (i === Math.round(p.leaves[j].f * H)) drawLeaf(x, y, p.leaves[j], p);
        if (p.k === 'sprig' && p.stage === 2 && p.grow > 0.95) {
          if (i === Math.round(H * 0.55)) { for (j = 1; j <= 4; j++) put(x - j, y - Math.round(j * 0.7), p.stemC); blit(p.mini, x - 6, y - 5); sideBox = x - 6; }
          if (i === Math.round(H * 0.75)) { for (j = 1; j <= 3; j++) put(x + j, y - Math.round(j * 0.7), p.stemC); blit(p.bud, x + 3, y - 5); }
        }
        tx = x; ty = y;
      }
      for (j = 1; j <= hop; j++) put(tx, ty - j, p.stemC);
      ty -= hop;
      var bx0, by0, bx1, by1, cx = tx;
      if (p.stage === 0 || p.grow < 0.4) {
        put(tx - 1, ty, p.leafL); put(tx - 2, ty - 1, p.leafL); put(tx + 1, ty, p.leafL); put(tx + 2, ty - 1, p.leafL); put(tx - 2, ty, p.leafD); put(tx + 2, ty, p.leafD);
        bx0 = tx - 5; bx1 = tx + 5; by0 = ty - 5; by1 = groundY;
        p.perch = null;
      } else if (p.stage === 1 || p.grow < 0.95) {
        blit(p.bud, tx - 1, ty - 3);
        bx0 = tx - 4; bx1 = tx + 4; by0 = ty - 5; by1 = ty + 2;
        p.perch = null;
      } else if (p.k === 'bluebell') {
        var bsw = Math.round(wind(p.x, t) * 0.6), minY = ty, maxY = ty, ex = tx;
        var steps = p.aw * 3;
        for (j = 0; j <= steps; j++) {
          var u = j / steps, ax = tx + p.dir * u * p.aw, ay = ty - Math.sin(u * Math.PI * 0.9) * 2 + u * u * 3;
          put(ax, ay, p.stemC);
          minY = Math.min(minY, Math.round(ay)); ex = ax;
        }
        for (j = 0; j < p.bells; j++) {
          var ub = 0.15 + j * (0.85 / (p.bells - 1)), bxp = tx + p.dir * ub * p.aw, byp = ty - Math.sin(ub * Math.PI * 0.9) * 2 + ub * ub * 3;
          blit(p.bell, Math.round(bxp) - Math.floor(p.bell.w / 2) + bsw, Math.round(byp) + 1);
          maxY = Math.max(maxY, Math.round(byp) + 6);
        }
        bx0 = Math.min(tx, ex) - 3; bx1 = Math.max(tx, ex) + 3; by0 = minY - 1; by1 = maxY;
        cx = Math.round((tx + ex) / 2);
        p.perch = { x: tx + p.dir * 2, y: minY - 4 };
      } else if (p.k === 'tulip') {
        blit(p.head, tx - 3, ty - 7);
        bx0 = tx - 3; bx1 = tx + 3; by0 = ty - 7; by1 = ty;
        p.perch = { x: tx, y: by0 - 3 };
      } else if (p.k === 'daffodil') {
        var hx = p.dir > 0 ? tx - p.R : tx - (p.head.w - 1 - p.R);
        blit(p.head, hx, ty - p.R);
        bx0 = hx; bx1 = hx + p.head.w - 1; by0 = ty - p.R; by1 = ty + p.R;
        cx = tx;
        p.perch = { x: tx, y: by0 - 3 };
      } else {
        blit(p.head, tx - p.R, ty - p.R);
        bx0 = tx - p.R; bx1 = tx + p.R; by0 = ty - p.R; by1 = ty + p.R;
        p.perch = { x: tx, y: by0 - 3 };
      }
      if (sideBox != null) bx0 = Math.min(bx0, sideBox);
      p.box = { x0: bx0, y0: by0, x1: bx1, y1: by1 };
      p.wpt = { x: cx, y: by0 };
    }

    // butterflies
    var bfFrames = BF_PAL.map(function (m) { return [rows(BF_OPEN, m), rows(BF_HALF, m), rows(BF_SHUT, m)]; });
    var flies = [];
    function syncFlies() {
      while (flies.length < opts.butterflies) {
        var i = flies.length;
        var b = { x: rnd() * gw, y: 4 + rnd() * groundY * 0.4, vx: 0, vy: 0, state: 'fly', plant: null, tx: 0, ty: 0, timer: 0, ph: rnd() * 10, pal: (cfg.bfPalettes || [0, 1, 2])[i % (cfg.bfPalettes || [0, 1, 2]).length] };
        chooseTarget(b); flies.push(b);
      }
      if (flies.length > opts.butterflies) flies.length = Math.max(0, opts.butterflies);
    }
    function chooseTarget(b) {
      var free = plants.filter(function (p) {
        return !p.noPerch && p.perch && !p.watering && flies.every(function (o) { return o === b || o.plant !== p; }) && p !== b.lastPlant;
      });
      if (free.length && rnd() < 0.65) { b.plant = free[Math.floor(rnd() * free.length)]; b.timer = 9; }
      else { b.plant = null; b.tx = 6 + rnd() * (gw - 12); b.ty = 4 + rnd() * groundY * 0.5; b.timer = 2 + rnd() * 3; }
    }
    function updateFly(b, dt, t) {
      var spd = reduce ? 0.5 : 1;
      if (b.state === 'land') {
        if (b.plant.perch) { b.x = b.plant.perch.x; b.y = b.plant.perch.y; }
        b.timer -= dt;
        var near = pointer.in && Math.hypot(pointer.x - b.x, pointer.y - b.y) < 9;
        if (near || b.plant.watering || !b.plant.perch) b.timer = 0;
        if (b.timer <= 0) { b.state = 'fly'; b.lastPlant = b.plant; b.vy = -14; chooseTarget(b); }
        return;
      }
      var tx = b.tx, ty = b.ty;
      if (b.plant) { if (!b.plant.perch || b.plant.watering) { chooseTarget(b); return; } tx = b.plant.perch.x; ty = b.plant.perch.y; }
      var dx = tx - b.x, dy = ty - b.y, d = Math.hypot(dx, dy) || 0.001;
      var sp = 16 * spd * Math.min(1, d / 10 + 0.25);
      var dvx = dx / d * sp, dvy = dy / d * sp;
      var flut = Math.min(1, d / 10);
      dvy += Math.sin(t * 7 + b.ph) * 10 * flut * spd;
      dvx += Math.sin(t * 2.3 + b.ph) * 5 * flut * spd;
      if (pointer.in) {
        var px = b.x - pointer.x, py = b.y - pointer.y, pd = Math.hypot(px, py);
        if (pd < 14 && pd > 0.01) { dvx += px / pd * 40 * (1 - pd / 14); dvy += py / pd * 40 * (1 - pd / 14); }
      }
      var k = Math.min(1, dt * 3);
      b.vx += (dvx - b.vx) * k; b.vy += (dvy - b.vy) * k;
      b.x = Math.max(4, Math.min(gw - 5, b.x + b.vx * dt));
      b.y = Math.max(4, Math.min(groundY - 4, b.y + b.vy * dt));
      b.timer -= dt;
      if (b.plant && d < 1.6) { b.state = 'land'; b.timer = 2.5 + rnd() * 4; b.vx = b.vy = 0; }
      else if (!b.plant && (d < 3 || b.timer <= 0)) chooseTarget(b);
      else if (b.plant && b.timer <= 0) chooseTarget(b);
    }
    function drawFly(b, t) {
      var fr = bfFrames[b.pal], s;
      if (b.state === 'land') {
        var ph = (t + b.ph) % 2.4;
        s = ph < 0.15 ? fr[1] : ph < 0.4 ? fr[2] : ph < 0.55 ? fr[1] : fr[0];
      } else {
        s = [fr[0], fr[1], fr[2], fr[1]][Math.floor(t * 14 + b.ph * 3) % 4];
      }
      blit(s, Math.round(b.x - (s.w - 1) / 2), Math.round(b.y - s.h / 2));
    }

    // particles: sparkles, splashes, drops, petals
    var parts = [], drops = [], waters = [];
    var canR = buildCanFrames(1), canL = buildCanFrames(-1);
    function spark(x, y, type, vx, vy, life, c) { parts.push({ x: x, y: y, vx: vx, vy: vy, life: life, max: life, type: type, c: c, g: type === 'dot' ? 40 : 4 }); }
    function burst(p) {
      p.hop = 0.0001;
      var b = p.box || { x0: p.x - 3, y0: groundY - 8, x1: p.x + 3, y1: groundY };
      var cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2, n = p.k === 'tree' ? 14 : 9, i;
      for (i = 0; i < n; i++) {
        var a = -Math.PI / 2 + (rnd() - 0.5) * 2.6;
        spark(cx + (rnd() - 0.5) * (b.x1 - b.x0), cy + (rnd() - 0.5) * (b.y1 - b.y0) * 0.6, rnd() < 0.55 ? 'star' : 'plus', Math.cos(a) * (6 + rnd() * 10), Math.sin(a) * (6 + rnd() * 12), 0.8 + rnd() * 0.6);
      }
      if (p.k === 'tree') { for (i = 0; i < 34; i++) dropPetal(p, true); return; }
      if (p.k === 'bush') { for (i = 0; i < 3; i++) bushBloom(p.spr, rnd); return; }
      if (p.stage < 2) p.stage++;
      else p.extra = Math.min(p.maxExtra, p.extra + 1);
    }
    function dropPetal(p, burstMode) {
      var g = p.g, k = Math.floor(rnd() * g.cpx.length / 2) * 2;
      var cols = [C.bl2, C.bl3, C.bl4, C.bl3];
      parts.push({ type: 'petal', x: (p.ox || 0) + g.cpx[k], y: (p.oy || 0) + g.cpx[k + 1], vx: burstMode ? (rnd() - 0.5) * 20 : 0, vy: burstMode ? -rnd() * 6 : 0,
        fall: 4 + rnd() * 4, ph: rnd() * 6, life: 999, max: 999, rest: 0, c: pack(cols[Math.floor(rnd() * cols.length)]) });
    }
    function startWater(p) {
      p.watering = true; p.lastWater = T;
      var tgt = p.wpt, dir = tgt.x - 18 < 0 ? -1 : 1;
      var ax = tgt.x - dir * 8, ay = Math.max(9, tgt.y - 14);
      waters.push({ p: p, t0: T, dir: dir, ax: ax, ay: ay, acc: 0, burst: false });
    }
    function updateWater(w, dt) {
      var e = T - w.t0, frames = w.dir > 0 ? canR : canL, idx = 0, yOff = 0;
      if (e < 0.3) yOff = -Math.round((1 - e / 0.3) * 6);
      else if (e < 0.55) idx = Math.min(3, Math.floor((e - 0.3) / 0.25 * 4));
      else if (e < 1.75) idx = 3;
      else if (e < 2.0) idx = 3 - Math.min(3, Math.floor((e - 1.75) / 0.25 * 4));
      else yOff = -Math.round((e - 2.0) / 0.3 * 8);
      w.frame = frames[idx]; w.y = w.ay + yOff; w.hide = e > 2.0 && Math.floor(e * 30) % 2 === 0;
      if (e >= 0.5 && e < 1.75) {
        w.acc += dt;
        while (w.acc > 0.045) {
          w.acc -= 0.045;
          var f = w.frame;
          drops.push({ x: w.ax + f.tip.x + w.dir * 0.5 + (rnd() - 0.5), y: w.y + f.tip.y + 1, vx: w.dir * (2 + rnd() * 2), vy: 4 + rnd() * 4, p: w.p });
        }
      }
      if (e >= 1.85 && !w.burst) { w.burst = true; burst(w.p); }
      if (e > 2.3) { w.p.watering = false; return false; }
      return true;
    }

    // pointer
    var pointer = { x: -99, y: -99, in: false };
    function toGrid(ev) {
      var r = canvas.getBoundingClientRect();
      pointer.x = (ev.clientX - r.left) / r.width * gw;
      pointer.y = (ev.clientY - r.top) / r.height * gh;
      pointer.in = true;
    }
    function inBox(b, pad) { return b && pointer.x >= b.x0 - pad && pointer.x <= b.x1 + pad && pointer.y >= b.y0 - pad && pointer.y <= b.y1 + pad; }
    function hitPlant() {
      for (var i = plants.length - 1; i >= 0; i--) if (plants[i].wpt && inBox(plants[i].box, 2)) return plants[i];
      return null;
    }
    function onMove(ev) {
      toGrid(ev);
      canvas.style.cursor = !opts.paused && ((bird && inBox(bird.box, 1)) || hitPlant()) ? 'pointer' : 'default';
    }
    function onDown(ev) {
      toGrid(ev);
      if (bird && inBox(bird.box, 1)) { if (!opts.paused) chirp(); return; }
      var p = hitPlant();
      if (opts.paused) return;
      if (p && !p.watering && T - p.lastWater > 1.2) startWater(p);
    }
    function onLeave() { pointer.in = false; }
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointerleave', onLeave);

    // ground strip
    var groundPx = [];
    for (var gy = groundY + 1; gy < gh; gy++) for (var gx = 0; gx < gw; gx++) {
      var hv = hash(gx, gy, 11);
      groundPx.push(pack(gy === groundY + 1 ? (hv < 0.3 ? C.g4 : C.g3) : (hv < 0.12 ? C.g1 : hv > 0.9 ? C.g3 : C.g2)));
    }

    var clouds = (cfg.clouds || []).map(function (c, ci) {
      return { x: c.x * gw, y: c.y, v: c.speed || 1, s: genCloud(c.w || 26, c.h || 8, (cfg.seed || 7) * 31 + ci) };
    });
    var petalClock = 0, twinkleClock = 1;
    function step(dt) {
      T += dt;
      var i;
      for (i = 0; i < clouds.length; i++) {
        var cl = clouds[i];
        cl.x += cl.v * dt * (reduce ? 0.5 : 1);
        if (cl.x > gw + 2) cl.x = -cl.s.w - rnd() * 30;
      }
      // gusts
      nextGust -= dt;
      if (nextGust <= 0 && !reduce && cfg.gusts !== false) { gusts.push({ pos: -40, speed: 55 + rnd() * 30, amp: 1.6 + rnd() * 1.2, width: 22 + rnd() * 18 }); nextGust = 5 + rnd() * 6; }
      for (i = gusts.length - 1; i >= 0; i--) { gusts[i].pos += gusts[i].speed * dt; if (gusts[i].pos > gw + 60) gusts.splice(i, 1); }
      // plants
      for (i = 0; i < plants.length; i++) {
        var p = plants[i];
        if (p.hop > 0) { p.hop += dt * 2.2; if (p.hop >= 1) p.hop = 0; }
        if (p.k !== 'tree') { var target = STAGE_GROW[p.stage]; if (p.grow < target) p.grow = Math.min(target, p.grow + dt * 0.9); }
      }
      waters = waters.filter(function (w) { return updateWater(w, dt); });
      for (i = drops.length - 1; i >= 0; i--) {
        var d = drops[i]; d.vy += 70 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
        var b = d.p.box, hit = d.p.k !== 'tree' && b && d.y >= b.y0 + 1 && d.x >= b.x0 - 1 && d.x <= b.x1 + 1;
        if (hit || d.y >= groundY) {
          spark(d.x, d.y - 1, 'dot', -8 - rnd() * 6, -6 - rnd() * 6, 0.25, pack(C.w2));
          spark(d.x, d.y - 1, 'dot', 8 + rnd() * 6, -6 - rnd() * 6, 0.25, pack(C.w1));
          drops.splice(i, 1);
        }
      }
      for (i = parts.length - 1; i >= 0; i--) {
        var q = parts[i];
        if (q.type === 'petal') {
          if (q.rest > 0) { q.rest -= dt; if (q.rest <= 0) parts.splice(i, 1); continue; }
          q.vx += ((wind(q.x, T) * 6 + Math.sin(T * 3 + q.ph) * 4) - q.vx) * Math.min(1, dt * 2);
          q.vy += (q.fall - q.vy) * Math.min(1, dt * 2);
          q.x += q.vx * dt; q.y += q.vy * dt;
          if (q.y >= groundY + 1) { q.y = groundY + 1; q.rest = 1.5 + rnd() * 2; }
          if (q.x < -4 || q.x > gw + 4) parts.splice(i, 1);
          continue;
        }
        q.life -= dt;
        if (q.life <= 0) { parts.splice(i, 1); continue; }
        q.vy += q.g * dt; q.vx *= 1 - Math.min(1, dt * 2.5); q.vy *= 1 - Math.min(1, dt * 1.2);
        q.x += q.vx * dt; q.y += q.vy * dt;
      }
      if (tree) {
        petalClock -= dt;
        if (petalClock <= 0) { dropPetal(tree, false); petalClock = 0.35 + rnd() * 0.5; }
      }
      if (cfg.twinkle) {
        twinkleClock -= dt;
        if (twinkleClock <= 0) {
          var bloomed = plants.filter(function (pl) { return pl.box && pl.stage === 2 && pl.k !== 'tree'; });
          if (bloomed.length) {
            var tp = bloomed[Math.floor(rnd() * bloomed.length)].box;
            spark(tp.x0 - 4 + rnd() * (tp.x1 - tp.x0 + 8), tp.y0 - 5 + rnd() * 8, 'twinkle', 0, -1, 0.9);
          }
          twinkleClock = 0.4 + rnd() * 0.9;
        }
      }
      if (bird) {
        if (bird.hop > 0) { bird.hop += dt * 2.5; if (bird.hop >= 1) bird.hop = 0; }
        if (bird.flick > 0) bird.flick -= dt;
        bird.next -= dt;
        if (bird.next <= 0) { bird.flick = 0.35; bird.next = 2.5 + rnd() * 4; }
      }
      syncFlies();
      for (i = 0; i < flies.length; i++) updateFly(flies[i], dt, T);
    }

    var S0 = pack(C.sp0), S1 = pack(C.sp1), S2 = pack(C.sp2);
    function drawPart(q) {
      if (q.type === 'petal') {
        put(q.x, q.y, q.c);
        if (Math.sin(T * 5 + q.ph) > 0.2 && q.rest <= 0) put(q.x + 1, q.y, q.c);
        return;
      }
      var f = q.life / q.max, x = Math.round(q.x), y = Math.round(q.y);
      if (q.type === 'dot') { put(x, y, q.c); return; }
      if (q.type === 'note') {
        if (f < 0.25 && Math.floor(q.life * 30) % 2) return;
        var N = pack('#e0283a');
        put(x, y, N); put(x + 1, y, N); put(x + 1, y - 1, N); put(x + 1, y - 2, N); put(x + 1, y - 3, N); put(x + 2, y - 3, N); put(x + 2, y - 2, N);
        return;
      }
      if (q.type === 'twinkle') {
        if (f > 0.3 && f < 0.7) { put(x, y, S2); put(x - 1, y, S1); put(x + 1, y, S1); put(x, y - 1, S1); put(x, y + 1, S1); }
        else put(x, y, S1);
        return;
      }
      if (f < 0.3 && Math.floor(q.life * 30) % 2) return;
      if (q.type === 'star' && f > 0.6) {
        put(x, y, S2);
        put(x - 1, y, S1); put(x + 1, y, S1); put(x, y - 1, S1); put(x, y + 1, S1);
        put(x - 2, y, S0); put(x + 2, y, S0); put(x, y - 2, S0); put(x, y + 2, S0);
      } else if (f > 0.3) {
        put(x, y, S2); put(x - 1, y, S0); put(x + 1, y, S0); put(x, y - 1, S0); put(x, y + 1, S0);
      } else put(x, y, S1);
    }

    function render() {
      var t = T, i;
      buf.fill(0);
      for (i = 0; i < clouds.length; i++) blit(clouds[i].s, clouds[i].x, clouds[i].y);
      for (i = 0; i < back.length; i++) drawBlade(back[i], t);
      for (i = 0; i < plants.length; i++) drawPlant(plants[i], t);
      var W1 = pack(C.w1), W2 = pack(C.w2);
      for (i = 0; i < drops.length; i++) { put(drops[i].x, drops[i].y, W1); put(drops[i].x, drops[i].y - 1, W2); }
      for (i = 0; i < front.length; i++) drawBlade(front[i], t);
      for (i = 0; i < daisies.length; i++) blit(daisySprite, daisies[i].x - 1 + Math.round(wind(daisies[i].x, t) * 0.5), daisies[i].y - 1);
      var o = (groundY + 1) * gw;
      for (i = 0; i < groundPx.length; i++) buf[o + i] = groundPx[i];
      for (i = 0; i < waters.length; i++) {
        var w = waters[i];
        if (!w.hide) blit(w.frame, Math.round(w.ax - w.frame.R), Math.round(w.y - w.frame.R));
      }
      if (bird) drawBird();
      for (i = 0; i < flies.length; i++) drawFly(flies[i], t);
      for (i = 0; i < parts.length; i++) drawPart(parts[i]);
      ctx.putImageData(img, 0, 0);
    }

    // loop — paused when off screen or tab hidden
    var raf = 0, last = performance.now(), visible = true, dead = false;
    function tick(now) {
      raf = 0;
      var dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
      step(dt); render(); schedule();
    }
    function schedule() { if (!raf && !dead && !opts.paused && visible && !document.hidden) raf = requestAnimationFrame(tick); }
    function onVis() { last = performance.now(); schedule(); }
    document.addEventListener('visibilitychange', onVis);
    var io = null;
    if (window.IntersectionObserver) {
      io = new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) { last = performance.now(); schedule(); } });
      io.observe(canvas);
    }
    // settle a first frame so heads/boxes exist before any hover
    step(0.016); render(); schedule();

    return {
      set: function (o) {
        if (o.wind != null) opts.wind = o.wind;
        if (o.butterflies != null) opts.butterflies = Math.max(0, Math.min(8, o.butterflies | 0));
        if (o.paused != null && o.paused !== opts.paused) {
          opts.paused = o.paused;
          if (opts.paused) { if (raf) cancelAnimationFrame(raf); raf = 0; canvas.style.cursor = 'default'; }
          else { last = performance.now(); schedule(); }
        }
      },
      destroy: function () {
        dead = true;
        if (raf) cancelAnimationFrame(raf);
        canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerdown', onDown);
        canvas.removeEventListener('pointerleave', onLeave);
        document.removeEventListener('visibilitychange', onVis);
        if (io) io.disconnect();
      }
    };
  }

export { mount };
