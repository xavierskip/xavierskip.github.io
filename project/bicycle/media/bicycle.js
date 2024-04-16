"use strict";

let metric = true;


let animated_drawers = [];
let units_drawers = [];

let wheel_velocity1;
let wheel_velocity2;
let bike_force_longitudinal;
let bike_force_cornering;
let wheel_spokes_lat_length;
let wheel_spokes_lat2;
let bending3;
let spoke_pushing;
let fem3;
let fem4;
let fem6;
let fem7;
let torsion4;

let models_ready = false;

(function() {

  const pi = Math.PI;

  const sqrt = Math.sqrt;
  const sin = Math.sin;
  const cos = Math.cos;
  const tan = Math.tan;
  const atan = Math.atan;
  const atan2 = Math.atan2;
  const pow = Math.pow;
  const max = Math.max;
  const min = Math.min;
  const abs = Math.abs;
  const exp = Math.exp;
  const round = Math.round;
  const floor = Math.floor;
  const ceil = Math.ceil;
  const sinh = Math.sinh;
  const cosh = Math.cosh;

  const touch_size = matchMedia("(pointer:coarse)").matches;

  const scale = (window.devicePixelRatio || 1) > 1.75 ? 2 : 1;

  let all_drawers = [];
  let all_containers = [];

  const spoke_knee_R = 3;
  const spoke_thread_L = 9;

  let hub_R = 65 / 2;
  let hub_width = 65;
  let small_hub_width = 4;
  let rim_inner_R = 282.8;
  let rim_outer_R = 315.0;
  let tire_r = 11.5;
  let tire_outer_R = rim_outer_R + tire_r + 7;

  let radial_spoke_L = 252;
  let n_spokes = 32;

  let front_sprocket_n = 48;
  let rear_sprocket_n = 18;

  let gear_ratio = front_sprocket_n / rear_sprocket_n;
  let front_sprocket_R = front_sprocket_n * 25.4 / (4 * pi);
  let rear_sprocket_R = front_sprocket_R / gear_ratio;




  const steer_axis_angle = 73 * pi / 180;
  const steer_axis = [-cos(steer_axis_angle), sin(steer_axis_angle), 0];

  let rear = [0, 0, 0];
  let front = [985, 0, 0];
  let front_up = [805, 450, 0];
  let front_down = vec_sub(front_up, vec_scale(steer_axis, 80));
  let seat = [250, 450, 0];
  let sprocket = [400, -70, 0];
  let bike_cog = [430, 140, 0];
  let wheelbase = front[0] - rear[0];

  let seat_axis_angle = Math.atan2(seat[1] - sprocket[1], seat[0] - sprocket[0]);
  const seat_axis = [cos(seat_axis_angle), sin(seat_axis_angle), 0];

  let crank_length = 165;

  let rear_dropout_width = 120;
  let front_dropout_width = 110;

  const g = 9.81;
  const bike_mass = 10;
  const human_mass = 80;
  const total_mass = human_mass + bike_mass;

  const bike_weight = bike_mass * g;
  const human_weight = human_mass * g;
  const total_weight = total_mass * g;

  const base_steer_axis_angle = steer_axis_angle;

  let models = {
    "Arrow": {
      "index_offset": 0,
      "index_count": 72,
      "line_index_offset": 72,
      "line_index_count": 126,
    },
    "Bolt_head": {
      "index_offset": 198,
      "index_count": 336,
      "line_index_offset": 534,
      "line_index_count": 384,
    },
    "Brake_back": {
      "index_offset": 918,
      "index_count": 558,
      "line_index_offset": 1476,
      "line_index_count": 570,
    },
    "Brake_body": {
      "index_offset": 2046,
      "index_count": 2946,
      "line_index_offset": 4992,
      "line_index_count": 360,
    },
    "Brake_clamp": {
      "index_offset": 5352,
      "index_count": 768,
      "line_index_offset": 6120,
      "line_index_count": 816,
    },
    "Brake_front": {
      "index_offset": 6936,
      "index_count": 1356,
      "line_index_offset": 8292,
      "line_index_count": 1230,
    },
    "Brake_handle": {
      "index_offset": 9522,
      "index_count": 1389,
      "line_index_offset": 10911,
      "line_index_count": 288,
    },
    "Brake_mid": {
      "index_offset": 11199,
      "index_count": 1302,
      "line_index_offset": 12501,
      "line_index_count": 1290,
    },
    "Brake_pad": {
      "index_offset": 13791,
      "index_count": 654,
      "line_index_offset": 14445,
      "line_index_count": 774,
    },
    "Crank_sprocket": {
      "index_offset": 15219,
      "index_count": 630,
      "line_index_offset": 15849,
      "line_index_count": 444,
    },
    "Crank": {
      "index_offset": 16293,
      "index_count": 1710,
      "line_index_offset": 18003,
      "line_index_count": 756,
    },
    "Dropout_front": {
      "index_offset": 18759,
      "index_count": 480,
      "line_index_offset": 19239,
      "line_index_count": 516,
    },
    "Dropout_rear": {
      "index_offset": 19755,
      "index_count": 528,
      "line_index_offset": 20283,
      "line_index_count": 540,
    },
    "Felloe": {
      "index_offset": 20823,
      "index_count": 522,
      "line_index_offset": 21345,
      "line_index_count": 534,
    },
    "Front_lugs": {
      "index_offset": 21879,
      "index_count": 1008,
      "line_index_offset": 22887,
      "line_index_count": 642,
    },
    "Hub_simple_fin": {
      "index_offset": 23529,
      "index_count": 417,
      "line_index_offset": 23946,
      "line_index_count": 48,
    },
    "Hub_simple_hole": {
      "index_offset": 23994,
      "index_count": 381,
      "line_index_offset": 24375,
      "line_index_count": 132,
    },
    "Hub_wood": {
      "index_offset": 24507,
      "index_count": 510,
      "line_index_offset": 25017,
      "line_index_count": 498,
    },
    "Moment_arrow": {
      "index_offset": 25515,
      "index_count": 930,
      "line_index_offset": 26445,
      "line_index_count": 978,
    },
    "Nipple": {
      "index_offset": 27423,
      "index_count": 2586,
      "line_index_offset": 30009,
      "line_index_count": 1818,
    },
    "Pedal": {
      "index_offset": 31827,
      "index_count": 858,
      "line_index_offset": 32685,
      "line_index_count": 1002,
    },
    "Rim_pad": {
      "index_offset": 33687,
      "index_count": 63,
      "line_index_offset": 33750,
      "line_index_count": 84,
    },
    "Rim": {
      "index_offset": 33834,
      "index_count": 3147,
      "line_index_offset": 36981,
      "line_index_count": 1002,
    },
    "Seat_bottom": {
      "index_offset": 37983,
      "index_count": 897,
      "line_index_offset": 38880,
      "line_index_count": 516,
    },
    "Seat_clamp": {
      "index_offset": 39396,
      "index_count": 300,
      "line_index_offset": 39696,
      "line_index_count": 402,
    },
    "Seat_top": {
      "index_offset": 40098,
      "index_count": 246,
      "line_index_offset": 40344,
      "line_index_count": 288,
    },
    "Sprocket": {
      "index_offset": 40632,
      "index_count": 552,
      "line_index_offset": 41184,
      "line_index_count": 282,
    },
    "Steering_clamp": {
      "index_offset": 41466,
      "index_count": 477,
      "line_index_offset": 41943,
      "line_index_count": 378,
    },
    "Tire_iron": {
      "index_offset": 42321,
      "index_count": 300,
      "line_index_offset": 42621,
      "line_index_count": 288,
    },
    "Cylinder": {
      "index_offset": 42909,
      "index_count": 372,
      "line_index_offset": 43281,
      "line_index_count": 384,
    },
    "Seat": {
      "index_offset": 43665,
      "index_count": 1992,
      "line_index_offset": 45657,
      "line_index_count": 0,
    },
    "Humanoid": {
      "vertex_offset": 9852,
      "vertex_count": 22212,
    },
  }
  let bone_hierarchy = {
    "Humanoid": [{
      index: -1,
      name: "(null)",
      parent_transform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      inv_transform: [(null)],
      children: [{
          index: 0,
          name: "Root",
          parent_transform: [1, 0, 0, 0, 0, 0.338002, -0.9411454, -0.1759118, 0, 0.9411454, 0.338002, 0.06002646, 0, 0, 0, 1],
          inv_transform: [1, 0, 0, 0, 0, 0.338002, 0.9411454, 0.002964854, 0, -0.9411454, 0.338002, -0.1858476, 0, 0, 0, 1],
          children: [{
              index: 1,
              name: "Spine",
              parent_transform: [1, 0, 0, 0, 0, 0.9712413, -0.2380976, 0.4889988, 0, 0.2380976, 0.9712413, -1.21072e-8, 0, 0, 0, 1],
              inv_transform: [1, 0, 0, 0, 0, 0.104197, 0.9945566, -0.5163061, 0, -0.9945566, 0.104197, -0.06477934, 0, 0, 0, 1],
              children: [{
                  index: 2,
                  name: "Neck",
                  parent_transform: [1, 0, 0, 0, 0, 0.9462818, -0.3233429, 1.043185, 0, 0.3233429, 0.9462819, 7.45058e-9, 0, 0, 0, 1],
                  inv_transform: [1, 0, 0, 0, 0, -0.222983, 0.9748223, -1.496664, 0, -0.9748222, -0.222983, 0.4429507, 0, 0, 0, 1],
                  children: [{
                    index: 3,
                    name: "Head",
                    parent_transform: [1, 0, 0, 0, 0, 0.9877754, 0.1558833, 0.2356059, 0, -0.1558833, 0.9877755, 2.6077e-8, 0, 0, 0, 1],
                    inv_transform: [1, 0, 0, 0, 0, -0.06829869, 0.9976649, -1.780143, 0, -0.9976648, -0.06829869, 0.1675039, 0, 0, 0, 1],
                  }, ],
                },
                {
                  index: 4,
                  name: "Arm",
                  parent_transform: [0.9145997, 0.4015319, 0.04775711, 0.4539124, 0.400737, -0.9158351, 0.02562704, 1.021251, 0.05402777, -0.004300475, -0.9985301, 0.001223624, 0, 0, 0, 1],
                  inv_transform: [0.9145984, -0.01197808, 0.4041841, -1.034868, 0.4015321, -0.09115016, -0.9112976, 1.226171, 0.04775708, 0.9957651, -0.07855623, 0.004825294, 0, 0, 0, 1],
                  children: [{
                    index: 5,
                    name: "Forearm",
                    parent_transform: [0.9914153, -0.1253711, -0.03711864, 0.003329039, 0.1296366, 0.979505, 0.1541561, 1.085611, 0.01703118, -0.1576446, 0.9873491, 0.04971693, 0, 0, 0, 1],
                    inv_transform: [0.9596135, -0.006732583, 0.2812389, -1.011827, 0.2711099, -0.2447574, -0.9309098, 0.274917, 0.07510292, 0.9695609, -0.2330473, 0.01588112, 0, 0, 0, 1],
                    children: [{
                      index: 6,
                      name: "Wrist",
                      parent_transform: [0.9992, -0.01510873, -0.03702749, 0, 0.009651586, 0.9896243, -0.1433547, 0.6198667, 0.03880919, 0.1428827, 0.9889784, 1.86265e-8, 0, 0, 0, 1],
                      inv_transform: [0.9643771, 0.02853834, 0.2629847, -1.013731, 0.2645294, -0.1035827, -0.9587985, -0.3238142, -0.000121787, 0.9942113, -0.107442, 0.1026217, 0, 0, 0, 1],
                      children: [{
                        index: 7,
                        name: "Fingers0",
                        parent_transform: [0.9781538, 0.1611625, 0.1313089, 0, -0.1410849, 0.9785587, -0.1500597, 0.2818783, -0.1526775, 0.1282558, 0.9799185, 0, 0, 0, 0, 1],
                        inv_transform: [0.9060064, -0.1092648, 0.4089155, -0.9217982, 0.4142633, 0.03075087, -0.9096373, -0.7429192, 0.08681672, 0.9935368, 0.07312488, 0.05833905, 0, 0, 0, 1],
                        children: [{
                          index: 8,
                          name: "fFinFingers1",
                          parent_transform: [0.9895578, -0.06470522, -0.1287955, 0, 0.06398886, 0.9979035, -0.009696584, 0.09320849, 0.1291529, 0.001353845, 0.9916238, 0, 0, 0, 0, 1],
                          inv_transform: [0.9342669, 0.02216202, 0.3558833, -0.9581411, 0.354889, 0.03910154, -0.9340903, -0.7746506, -0.03461694, 0.9989894, 0.02866625, 0.1846815, 0, 0, 0, 1],
                        }, ],
                      }, ],
                    }, ],
                  }, ],
                },
              ],
            },
            {
              index: 9,
              name: "Thigh",
              parent_transform: [0.9999946, 0.002313694, 0.002299285, 0.2794632, 0.001381925, -0.9390138, 0.3438769, 0.031309, 0.002954697, -0.3438719, -0.9390131, -0.1685721, 0, 0, 0, 1],
              inv_transform: [0.9999948, -0.002313673, 0.002299249, -0.2795519, 0.002313673, 0.00624448, -0.9999778, 0.03190946, 0.002299249, 0.9999768, 0.006250202, 0.005832493, 0, 0, 0, 1],
              children: [{
                index: 10,
                name: "Shin",
                parent_transform: [0.9960209, 0.08891983, -0.005968598, 0.00915128, -0.08893445, 0.996035, -0.002227138, 1.176525, 0.005746896, 0.00274909, 0.9999796, 0.06276307, 0, 0, 0, 1],
                inv_transform: [0.9958231, 0.002886891, 0.09125846, -0.1860858, 0.09123021, 0.008763015, -0.9957912, -1.165905, -0.003674447, 0.9999564, 0.008463442, -0.052657, 0, 0, 0, 1],
                children: [{
                  index: 11,
                  name: "Foot",
                  parent_transform: [0.9980897, 0.05598268, -0.02613655, 2.98023e-8, 0.02427477, 0.03368213, 0.9991378, 1.157263, 0.05681473, -0.9978633, 0.03225882, 7.45058e-9, 0, 0, 0, 1],
                  inv_transform: [0.9959263, 0.05990636, 0.06739234, -0.2451164, 0.06248825, -0.9973633, -0.03687679, -0.03612232, 0.0650056, 0.04093742, -0.9970448, -2.318, 0, 0, 0, 1],
                }, ],
              }, ],
            },
          ],
        },
      ],
    }, ],
  };



  function hex_to_color(str) {

    let i = str.length == 7;

    return [
      parseInt(str.substring(0 + i, 2 + i), 16) / 255.0,
      parseInt(str.substring(2 + i, 4 + i), 16) / 255.0,
      parseInt(str.substring(4 + i, 6 + i), 16) / 255.0,
      1.0
    ];
  }


  let force_color_css = ["#EE606A", "#8D2F36"];
  let force1_color_css = ["#3D7FCD", "#1D436E"];
  let force2_color_css = ["#7CBC4F", "#486F2C"];
  let force3_color_css = ["#F5A4C9", "#945367"];
  let force4_color_css = ["#EF935C", "#954726"];
  let force5_color_css = ["#86D3E6", "#487681"];
  let force6_color_css = ["#FFD063", "#7F662D"];

  let force_color = hex_to_color(force_color_css[0]);
  let force1_color = hex_to_color(force1_color_css[0]);
  let force2_color = hex_to_color(force2_color_css[0]);
  let force3_color = hex_to_color(force3_color_css[0]);
  let force4_color = hex_to_color(force4_color_css[0]);
  let force5_color = hex_to_color(force5_color_css[0]);
  let force6_color = hex_to_color(force6_color_css[0]);

  let human_color = hex_to_color("#EBBC38")

  let frame_color = hex_to_color("#75B3D8")

  let gray_bike_color = hex_to_color("#cccccc")


  let left_spokes_color = force5_color;
  let right_spokes_color = force4_color;

  let models_colors = {

    "Hub_simple_fin": hex_to_color("#F1C867"),
    "Hub_simple_hole": hex_to_color("#F1C867"),
    "Rim": hex_to_color("#668CC3"),
    "Rim_pad": hex_to_color("#668CC3"),
    "Spoke": hex_to_color("#888888"),
    "Nipple": hex_to_color("#EC6A6A"),
    "Nipple_arrow": hex_to_color("#bbbbbb"),

    "Base_Hub_simple_fin": hex_to_color("#dddddd"),
    "Base_Hub_simple_hole": hex_to_color("#dddddd"),
    "Base_Rim": hex_to_color("#DBC098"),
    "Base_Rim_pad": hex_to_color("#dddddd"),
    "Base_Spoke": hex_to_color("#888888"),
    "Base_Nipple": hex_to_color("#888888"),
    "Base_Nipple_arrow": hex_to_color("#DF6C52"),

    "Hub_wood": hex_to_color("#A27C55"),
    "Spoke_wood": hex_to_color("#D4B595"),
    "Felloe": hex_to_color("#AB8E6F"),
    "Tire_iron": hex_to_color("#333333"),
    "Crank": hex_to_color("#aaaaaa"),
    "Crank_sprocket": hex_to_color("#aaaaaa"),

    "Brake_front": hex_to_color("#666666"),
    "Brake_mid": hex_to_color("#666666"),
    "Brake_back": hex_to_color("#666666"),
    "Brake_clamp": hex_to_color("#666666"),
    "Brake_pad": hex_to_color("#444444"),

    "Brake_body": hex_to_color("#555555"),


    "Seat": hex_to_color("#444444"),
    "Moment_arrow": force_color,
  }


  let force_gray = false;

  let gl = new GLDrawer(scale, function() {
    models_ready = true;
    all_drawers.forEach(drawer => {
      drawer.f_draw = true;
      drawer.request_repaint();
    });
  });


  function GLDrawer(scale, ready_callback) {

    const canvas = document.createElement("canvas");
    this.canvas = canvas;

    const gl = canvas.getContext('experimental-webgl', { antialias: true });
    gl.getExtension('OES_element_index_uint');

    let ext = gl.getExtension('ANGLE_instanced_arrays');

    const float_size = 4;

    let full_screen_vertices = [
      -1.0, -1.0,
      3.0, -1.0,
      -1.0, 3.0,
    ];

    let full_screen_vertex_buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, full_screen_vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(full_screen_vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let basic_vertex_buffer = gl.createBuffer();
    let basic_index_buffer = gl.createBuffer();

    let vertex_buffer = gl.createBuffer();
    let index_buffer = gl.createBuffer();

    let cs32_buffer = gl.createBuffer();
    let cs16_buffer = gl.createBuffer();

    let has_vertices = false;
    let has_indicies = false;
    let has_basic = false;


    function mark_ready() {
      if (has_vertices && has_indicies && has_basic) {
        ready_callback();
      }
    }

    download_file("/models/bicycle_vertices.dat", function(buffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      has_vertices = true;
      mark_ready();
    });

    download_file("/models/bicycle_indices.dat", function(buffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(buffer), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      has_indicies = true;
      mark_ready();
    });

    let fem_lut = [
      vec_scale(hex_to_color("#010004"), 255),
      vec_scale(hex_to_color("#241151"), 255),
      vec_scale(hex_to_color("#5f1780"), 255),
      vec_scale(hex_to_color("#982d80"), 255),
      vec_scale(hex_to_color("#d3436e"), 255),
      vec_scale(hex_to_color("#f7765b"), 255),
      vec_scale(hex_to_color("#ffba7f"), 255),
      vec_scale(hex_to_color("#fdeaab"), 255),
    ];

    let fem_lut_size = fem_lut.length;
    let fem_lut_scale = (1.0 / (fem_lut_size - 1)) * (fem_lut_size - 1) / fem_lut_size;

    let fem_lut_texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, fem_lut_texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    let pixels = new Uint8Array(flatten(fem_lut));

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fem_lut_size, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    
    
    for (let k = 0; k < 2; k++)
    {
      let trig = [];
      for (let i = 0; i < 32; i += (k + 1)) {
        let a = (i + 0.5) * pi * 2/ 32;
        trig.push(cos(a));
        trig.push(sin(a));
      }
      
      gl.bindBuffer(gl.ARRAY_BUFFER, k ? cs16_buffer : cs32_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(trig), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    

    let simple_models = {}

    let beam_index_offset = 0;
    let beam_index_count = 0;
    let beam_line_index_offset = 0;
    let beam_line_index_count = 0;

    let rod_index_offset = 0;
    let rod_index_count = 0;
    let rod_line_index_offset = 0;
    let rod_line_index_count = 0;


    const tube_tess = 32; {
      let vertices = [];
      let indices = [];
      let offset;
      let count;

      offset = indices.length;

      {
        let n = tube_tess;
        let m = 1;

        let off = vertices.length / 6;

        for (let j = 0; j <= n; j++) {

          let t = j / n;

          let x = Math.cos(t * Math.PI * 2);
          let y = Math.sin(t * Math.PI * 2);

          for (let i = 0; i <= m; i++) {

            let r = 1.0;
            let nx = x;
            let ny = y;
            let z = i;

            vertices.push(x * r);
            vertices.push(y * r);
            vertices.push(z);

            let v = [nx, ny, 0];

            vertices.push(v[0]);
            vertices.push(v[1]);
            vertices.push(v[2]);
          }
        }

        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {

            indices.push(off + j * (m + 1) + i);
            indices.push(off + j * (m + 1) + i + m + 2);
            indices.push(off + j * (m + 1) + i + 1);


            indices.push(off + j * (m + 1) + i);
            indices.push(off + j * (m + 1) + i + m + 1);
            indices.push(off + j * (m + 1) + i + m + 2);
          }
        }
      }

      simple_models["tube"] = { "index_offset": offset, "index_count": indices.length - offset }


      offset = indices.length;

      {
        let n = tube_tess;
        let m = 20;

        let off = vertices.length / 6;

        for (let j = 0; j <= n; j++) {

          let t = j / n;

          let x = Math.cos(t * Math.PI * 2);
          let y = Math.sin(t * Math.PI * 2);

          for (let i = 0; i <= m; i++) {

            let rot_t = sharp_step(0, m - 6, i);

            let r = 1.0;
            let nz = 0;
            let nx = x;
            let ny = y;
            let z = 0;

            if (i == m - 6) {
              z = -0.9;
            } else if (i == m - 5) {
              z = -1.0;
              r = 1.1;
              nz = 0.5;
            } else if (i == m - 4) {
              z = -2.4;
              r = 2;
              nz = 0.5;
            } else if (i == m - 3) {
              z = -2.6;
              r = 2;
              nz = 0.0;
            } else if (i == m - 2) {
              z = -2.6;
              r = 2;
              nz = -3;
            } else if (i == m - 1) {
              z = -2.7;
              r = 1.6;
              nz = -3;
            } else if (i == m) {
              z = -2.8;
              r = 0;
              nz = -1;
              nx = 0;
              ny = 0;
            }

            let p = [x * r, y * r, z];
            let v = [nx, ny, nz];
            v = vec_norm(v);


            let rot = rot_y_mat3(rot_t * pi * 0.5);

            let mat = translation_mat4([spoke_knee_R, 0, 0]);
            mat = mat4_mul(mat3_to_mat4(rot), mat);
            mat = mat4_mul(translation_mat4([-spoke_knee_R, 0, 0]), mat);

            p = mat4_mul_vec3(mat, p);
            v = mat3_mul_vec(rot, v);

            p[2] += spoke_knee_R;

            vertices.push(p[0]);
            vertices.push(p[1]);
            vertices.push(p[2]);


            vertices.push(v[0]);
            vertices.push(v[1]);
            vertices.push(v[2]);
          }
        }

        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {

            indices.push(off + j * (m + 1) + i);

            indices.push(off + j * (m + 1) + i + 1);
            indices.push(off + j * (m + 1) + i + m + 2);


            indices.push(off + j * (m + 1) + i);
            indices.push(off + j * (m + 1) + i + m + 2);
            indices.push(off + j * (m + 1) + i + m + 1);

          }
        }
      }

      simple_models["knee"] = { "index_offset": offset, "index_count": indices.length - offset }


      offset = indices.length;

      {
        let n = 40;
        let m = 30;

        let off = vertices.length / 6;

        for (let j = 0; j <= n; j++) {

          let t = j / n;

          let x = Math.cos(t * Math.PI * 2);
          let y = Math.sin(t * Math.PI * 2);

          for (let i = 0; i <= m; i++) {

            let tt = Math.max(0, Math.min(1, (i - 2) / (m - 9)));

            let rr = 12;
            let r = 3;
            let nz = 0;
            let nx = x;
            let ny = y;
            let z = 0;

            if (i == 0) {
              r = 0;
              nz = -1;
              nx = ny = 0;
            } else if (i == 1) {
              nz = -1;
              nx = ny = 0;
            } else if (i == m - 5) {
              z = 6;
            } else if (i == m - 4) {
              z = 6;
              nz = -1;
              nx = ny = 0;
            } else if (i == m - 3) {
              r *= 2;
              z = 6;
              nz = -1;
              nx = ny = 0;
            } else if (i == m - 2) {
              r *= 2;
              z = 6;
              nz = 1;
            } else if (i == m - 1) {
              r = 0;
              z = 25;
              nz = 1;
            }

            let a = (tt * 0.5 + 1) * Math.PI;


            if (i == m - 1) {
              vertices.push(+rr);
              vertices.push(0);

              vertices.push(-rr);

            } else {
              vertices.push((y * r + rr) * Math.cos(a));
              vertices.push(x * r);
              vertices.push((y * r + rr) * Math.sin(a));
            }
            nz = ny * Math.sin(a);
            ny *= Math.cos(a);

            if (i == 0 || i == 1) {
              ny = 0;
              nz = -1;
            } else if (i == m - 4 || i == m - 3) {
              ny = -1;
            } else if (i == m - 1 || i == m - 2) {
              ny = 0.3;
            }

            let v = [nx, ny, nz];
            v = vec_norm(v);

            vertices.push(v[1]);
            vertices.push(v[0]);
            vertices.push(v[2]);
          }
        }

        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {

            indices.push(off + j * (m + 1) + i);
            indices.push(off + j * (m + 1) + i + m + 2);
            indices.push(off + j * (m + 1) + i + 1);


            indices.push(off + j * (m + 1) + i);
            indices.push(off + j * (m + 1) + i + m + 1);
            indices.push(off + j * (m + 1) + i + m + 2);
          }
        }
      }


      simple_models["nipple_arrow"] = { "index_offset": offset, "index_count": indices.length - offset }


      offset = indices.length;

      {
        let threads = 18;
        let n = tube_tess * threads;
        let m = 1;

        let off = vertices.length / 6;

        let pitch = spoke_thread_L / threads;
        let r = 0.9;
        let base_r = 1.0;

        let z_max = (threads - 1) * pitch;

        for (let j = 0; j <= n; j++) {

          let thread = j / tube_tess;

          let offset = clamp(thread - 1, 0, threads - 1);
          let dr = 0.2 * (1.0 - smooth_step(threads - 0.5, threads, thread));
          let a = 2 * pi * thread;

          let x = Math.cos(a);
          let y = Math.sin(a);

          let v = vec_norm([x, y, -smooth_step(0, 1, offset)]);

          vertices.push(x * lerp(base_r, r, smooth_step(0, 1, offset)));
          vertices.push(y * lerp(base_r, r, smooth_step(0, 1, offset)));
          vertices.push(min((offset) * pitch, z_max));

          vertices.push(v[0]);
          vertices.push(v[1]);
          vertices.push(v[2]);

          vertices.push(x * lerp(base_r, r + dr, smooth_step(0, 1, offset + 0.5)));
          vertices.push(y * lerp(base_r, r + dr, smooth_step(0, 1, offset + 0.5)));
          vertices.push(min((offset + 0.5) * pitch, z_max));

          vertices.push(v[0]);
          vertices.push(v[1]);
          vertices.push(v[2]);



          vertices.push(x * lerp(base_r, r + dr, smooth_step(0, 1, offset + 0.5)));
          vertices.push(y * lerp(base_r, r + dr, smooth_step(0, 1, offset + 0.5)));
          vertices.push(min((offset + 0.5) * pitch, z_max));

          vertices.push(v[0]);
          vertices.push(v[1]);
          vertices.push(-v[2]);

          vertices.push(x * lerp(base_r, r, smooth_step(0, 1, offset + 1)));
          vertices.push(y * lerp(base_r, r, smooth_step(0, 1, offset + 1)));
          vertices.push(min((offset + 1.0) * pitch, z_max));

          vertices.push(v[0]);
          vertices.push(v[1]);
          vertices.push(-v[2]);
        }


        for (let j = 0; j < n; j++) {

          indices.push(off + j * 4 + 0);
          indices.push(off + j * 4 + 4);
          indices.push(off + j * 4 + 1);

          indices.push(off + j * 4 + 1);
          indices.push(off + j * 4 + 4);
          indices.push(off + j * 4 + 5);

          indices.push(off + j * 4 + 3);
          indices.push(off + j * 4 + 2);
          indices.push(off + j * 4 + 6);

          indices.push(off + j * 4 + 3);
          indices.push(off + j * 4 + 6);
          indices.push(off + j * 4 + 7);
        }


        for (let j = 0; j <= tube_tess; j++) {

          let t = j / tube_tess;


          let a = 2 * pi * t;

          let x = Math.cos(a);
          let y = Math.sin(a);

          vertices.push(x * r);
          vertices.push(y * r);
          vertices.push(z_max);

          vertices.push(0);
          vertices.push(0);
          vertices.push(1);
        }

        vertices.push(0);
        vertices.push(0);
        vertices.push(z_max);

        vertices.push(0);
        vertices.push(0);
        vertices.push(1);



        for (let j = 0; j < tube_tess; j++) {

          indices.push(off + 4 * (n + 1) + j);
          indices.push(off + 4 * (n + 1) + j + 1);
          indices.push(off + 4 * (n + 1) + tube_tess + 1);
        }
      }

      simple_models["thread"] = { "index_offset": offset, "index_count": indices.length - offset }


      offset = indices.length;

      {
        let threads = 18;
        let n = tube_tess * threads;
        let m = 1;

        let off = vertices.length / 6;

        let pitch = spoke_thread_L / threads;
        let r = 1.0;
        let base_r = 1.2;

        let z_max = (threads - 1) * pitch;
        let z_min = 0;

        let zz = -5.5;

        for (let j = 0; j <= n; j++) {

          let thread = j / tube_tess;

          let offset = thread - 1;
          let dr = 0.2;
          let ddr = smooth_step(z_min, z_min + pitch, offset * pitch) - smooth_step(z_max - pitch, z_max, (offset + 1) * pitch);

          let a = 2 * pi * thread + pi;

          let x = Math.cos(a);
          let y = Math.sin(a);

          let v = vec_norm([x, y, -ddr]);

          vertices.push(x * (base_r));
          vertices.push(y * (base_r));
          vertices.push(clamp((offset) * pitch, z_min, z_max));
          if (vertices[vertices.length - 1] == z_min)
            vertices[vertices.length - 1] = zz;

          vertices.push(v[0]);
          vertices.push(v[1]);
          vertices.push(v[2]);

          vertices.push(x * (base_r - dr * ddr));
          vertices.push(y * (base_r - dr * ddr));
          vertices.push(clamp((offset + 0.5) * pitch, z_min, z_max));

          vertices.push(v[0]);
          vertices.push(v[1]);
          vertices.push(v[2]);


          vertices.push(x * (base_r - dr * ddr));
          vertices.push(y * (base_r - dr * ddr));
          vertices.push(clamp((offset + 0.5) * pitch, z_min, z_max));

          vertices.push(v[0]);
          vertices.push(v[1]);
          vertices.push(-v[2]);

          vertices.push(x * (base_r));
          vertices.push(y * (base_r));
          vertices.push(clamp((offset + 1.0) * pitch, z_min, z_max));

          vertices.push(v[0]);
          vertices.push(v[1]);
          vertices.push(-v[2]);
        }


        for (let j = 0; j < n; j++) {

          indices.push(off + j * 4 + 0);
          indices.push(off + j * 4 + 1);
          indices.push(off + j * 4 + 4);

          indices.push(off + j * 4 + 1);
          indices.push(off + j * 4 + 5);
          indices.push(off + j * 4 + 4);

          indices.push(off + j * 4 + 3);
          indices.push(off + j * 4 + 6);
          indices.push(off + j * 4 + 2);

          indices.push(off + j * 4 + 3);
          indices.push(off + j * 4 + 7);
          indices.push(off + j * 4 + 6);
        }
      }

      simple_models["inner_thread"] = { "index_offset": offset, "index_count": indices.length - offset }

      offset = indices.length;

      {
        let n = tube_tess;
        let m = 64;

        let off = vertices.length / 6;

        for (let j = 0; j <= n; j++) {

          let t = j / n;

          let x = Math.cos(t * Math.PI * 2);
          let y = Math.sin(t * Math.PI * 2);

          for (let i = -2; i <= m + 2; i++) {

            let r = 1.0;
            let nx = x;
            let ny = y;
            let z = i / m;

            if (i == -2 || i == m + 2) {
              r = 0;
            }

            let n = [nx, ny, 0];

            if (i < 0) {
              z = 0;
              n = [0, 0, -1];
            } else if (i > m) {
              z = 1;
              n = [0, 0, 1];
            }

            vertices.push(x * r);
            vertices.push(y * r);
            vertices.push(z);


            vertices.push(n[0]);
            vertices.push(n[1]);
            vertices.push(n[2]);
          }
        }

        for (let i = 0; i < m + 4; i++) {
          for (let j = 0; j < n; j++) {

            indices.push(off + j * (m + 5) + i);
            indices.push(off + j * (m + 5) + i + m + 2 + 4);
            indices.push(off + j * (m + 5) + i + 1);


            indices.push(off + j * (m + 5) + i);
            indices.push(off + j * (m + 5) + i + m + 1 + 4);
            indices.push(off + j * (m + 5) + i + m + 2 + 4);
          }
        }
      }

      simple_models["flex_tube"] = { "index_offset": offset, "index_count": indices.length - offset }


      for (let k = 0; k < 2; k++) {
        offset = indices.length;

        let R = tire_outer_R - tire_r;
        let r = tire_r;

        let n = k ? 512 : 128;
        let m = k ? 64 : 16;

        let off = vertices.length / 6;

        for (let j = 0; j <= n; j++) {

          let t = j / n;

          let mat = rot_x_mat3(t * 2 * pi);

          let cc = mat3_mul_vec(mat, [0, R, 0]);

          for (let i = 0; i <= m; i++) {

            let a = i * 1.5 * pi / m + 1.25 * pi;
            let p = [r * sin(a), R + r * cos(a), 0]

            p = mat3_mul_vec(mat, p);

            vertices.push(p[0]);
            vertices.push(p[1]);
            vertices.push(p[2]);

            let v = vec_norm(vec_sub(p, cc));

            vertices.push(v[0]);
            vertices.push(v[1]);
            vertices.push(v[2]);
          }
        }

        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {

            indices.push(off + j * (m + 1) + i);
            indices.push(off + j * (m + 1) + i + m + 2);
            indices.push(off + j * (m + 1) + i + 1);


            indices.push(off + j * (m + 1) + i);
            indices.push(off + j * (m + 1) + i + m + 1);
            indices.push(off + j * (m + 1) + i + m + 2);
          }
        }

        simple_models[k ? "torus_h" : "torus"] = { "index_offset": offset, "index_count": indices.length - offset }

      }

      offset = indices.length;

      {
        let n = 24;

        let permute = [
          [0, 1, 2],
          [1, 2, 0],
          [2, 0, 1]
        ];

        for (let w = 0; w < 6; w++) {
          let off = vertices.length / 6;
          let sign = ((w & 1) ? -1 : 1);
          for (let j = 0; j <= n; j++) {

            let s = j / n - 0.5;

            for (let i = 0; i <= n; i++) {

              let t = i / n - 0.5;

              let p = [0, 0, 0];
              p[permute[w >> 1][0]] = s * sign;
              p[permute[w >> 1][1]] = t;
              p[permute[w >> 1][2]] = 0.5 * sign;

              p = vec_norm(p);

              vertices.push(p[0]);
              vertices.push(p[1]);
              vertices.push(p[2]);

              vertices.push(p[0]);
              vertices.push(p[1]);
              vertices.push(p[2]);
            }
          }

          for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {

              indices.push(off + j * (n + 1) + i);
              indices.push(off + j * (n + 1) + i + n + 2);
              indices.push(off + j * (n + 1) + i + 1);


              indices.push(off + j * (n + 1) + i);
              indices.push(off + j * (n + 1) + i + n + 1);
              indices.push(off + j * (n + 1) + i + n + 2);
            }
          }
        }
      }
      simple_models["sphere"] = { "index_offset": offset, "index_count": indices.length - offset }

      offset = indices.length;

      {

        let off = vertices.length / 6;

        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            vertices.push(0);
            vertices.push(i);
            vertices.push(j);

            vertices.push(1);
            vertices.push(0);
            vertices.push(0);
          }
        }

        indices.push(off + 0);
        indices.push(off + 1);
        indices.push(off + 2);
        indices.push(off + 1);
        indices.push(off + 2);
        indices.push(off + 3);
      }

      simple_models["quad"] = { "index_offset": offset, "index_count": indices.length - offset }

      {

        let n = 64;

        beam_index_offset = indices.length;

        for (let k = 0; k < 4; k++) {
          let off = vertices.length / 6;

          let y0 = [-1, -1, 1, -1][k];
          let y1 = [1, 1, 1, -1][k];
          let z0 = [-1, 1, 1, 1][k];
          let z1 = [-1, 1, -1, -1][k];

          let ny = [0, 0, 1, -1][k];
          let nz = [-1, 1, 0, 0][k];

          for (let i = 0; i <= n; i++) {
            let t = i / n;

            vertices.push(t);
            vertices.push(y0);
            vertices.push(z0);

            vertices.push(0);
            vertices.push(ny);
            vertices.push(nz);

            vertices.push(t);
            vertices.push(y1);
            vertices.push(z1);

            vertices.push(0);
            vertices.push(ny);
            vertices.push(nz);
          }

          for (let i = 0; i < n; i++) {
            indices.push(off + i * 2 + 0);
            indices.push(off + i * 2 + 1);
            indices.push(off + i * 2 + 2);
            indices.push(off + i * 2 + 1);
            indices.push(off + i * 2 + 3);
            indices.push(off + i * 2 + 2);
          }
        }

        for (let k = 0; k < 2; k++) {
          let off = vertices.length / 6;

          for (let i = 0; i < 4; i++) {

            vertices.push(k);
            vertices.push([-1, 1, 1, -1][i]);
            vertices.push([-1, -1, 1, 1][i]);

            vertices.push(k * 2 - 1);
            vertices.push(0);
            vertices.push(0);
          }

          indices.push(off + 0);
          indices.push(off + 1);
          indices.push(off + 2);
          indices.push(off + 0);
          indices.push(off + 3);
          indices.push(off + 2);
        }

        beam_index_count = indices.length - beam_index_offset;

        beam_line_index_offset = indices.length;

        for (let k = 0; k < 4; k++) {
          let off = vertices.length / 6;

          let y = [-1, -1, 1, 1][k];
          let z = [-1, 1, 1, -1][k];

          for (let i = 0; i < n; i++) {
            let t0 = (i + 0) / n;
            let t1 = (i + 1) / n;

            vertices.push(t0);
            vertices.push(y);
            vertices.push(z);
            vertices.push(-1);
            vertices.push(0);
            vertices.push(0);

            vertices.push(t0);
            vertices.push(y);
            vertices.push(z);
            vertices.push(-2);
            vertices.push(0);
            vertices.push(0);

            vertices.push(t1);
            vertices.push(y);
            vertices.push(z);
            vertices.push(2);
            vertices.push(0);
            vertices.push(0);

            vertices.push(t1);
            vertices.push(y);
            vertices.push(z);
            vertices.push(1);
            vertices.push(0);
            vertices.push(0);
          }

          for (let i = 0; i < n; i++) {
            indices.push(off + i * 4 + 0);
            indices.push(off + i * 4 + 1);
            indices.push(off + i * 4 + 2);
            indices.push(off + i * 4 + 1);
            indices.push(off + i * 4 + 3);
            indices.push(off + i * 4 + 2);
          }
        }

        for (let i = 0; i < 2; i++) {


          for (let k = 0; k < 4; k++) {
            let off = vertices.length / 6;

            let y0 = [-1, -1, 1, 1][k];
            let z0 = [-1, 1, 1, -1][k];

            let z1 = [1, 1, -1, -1][k];
            let y1 = [-1, 1, 1, -1][k];

            let ny = [0, 1, 0, -1][k];
            let nz = [1, 0, -1, 0][k];

            vertices.push(i);
            vertices.push(y0);
            vertices.push(z0);
            vertices.push(0);
            vertices.push(-ny);
            vertices.push(-nz);

            vertices.push(i);
            vertices.push(y0);
            vertices.push(z0);
            vertices.push(0);
            vertices.push(-2 * ny);
            vertices.push(-2 * nz);

            vertices.push(i);
            vertices.push(y1);
            vertices.push(z1);
            vertices.push(0);
            vertices.push(2 * ny);
            vertices.push(2 * nz);

            vertices.push(i);
            vertices.push(y1);
            vertices.push(z1);
            vertices.push(0);
            vertices.push(ny);
            vertices.push(nz);

            indices.push(off + 0);
            indices.push(off + 1);
            indices.push(off + 2);
            indices.push(off + 1);
            indices.push(off + 3);
            indices.push(off + 2);
          }
        }

        beam_line_index_count = indices.length - beam_line_index_offset;
      }

      {
        rod_index_offset = indices.length;

        let n = 64;
        let m = 64;

        for (let d = 0; d < 2; d++) {
          let off = vertices.length / 6;

          for (let j = 0; j <= n; j++) {

            let t = j / n;

            let x = Math.cos(t * Math.PI * 2);
            let y = Math.sin(t * Math.PI * 2);

            for (let i = 0; i <= m; i++) {

              let r = d * 0.5 + 0.5;
              let nx = x;
              let ny = y;
              let z = i / m;

              vertices.push(z);
              vertices.push(x * r);
              vertices.push(y * r);


              let v = [nx, ny, 0];

              vertices.push(v[2]);
              vertices.push(v[0]);
              vertices.push(v[1]);

            }
          }

          for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {

              indices.push(off + j * (m + 1) + i);
              indices.push(off + j * (m + 1) + i + m + 2);
              indices.push(off + j * (m + 1) + i + 1);


              indices.push(off + j * (m + 1) + i);
              indices.push(off + j * (m + 1) + i + m + 1);
              indices.push(off + j * (m + 1) + i + m + 2);
            }
          }

        }

        for (let d = 0; d < 2; d++) {
          let off = vertices.length / 6;

          for (let j = 0; j <= n; j++) {

            let t = j / n;

            let x = Math.cos(t * Math.PI * 2);
            let y = Math.sin(t * Math.PI * 2);

            vertices.push(d);
            vertices.push(x);
            vertices.push(y);

            vertices.push(d * 2 - 1);
            vertices.push(0);
            vertices.push(0);


            vertices.push(d);
            vertices.push(x * 0.5);
            vertices.push(y * 0.5);

            vertices.push(d * 2 - 1);
            vertices.push(0);
            vertices.push(0);

          }

          for (let j = 0; j < n; j++) {

            indices.push(off + j * 2 + 0);
            indices.push(off + j * 2 + 1);
            indices.push(off + j * 2 + 2);


            indices.push(off + j * 2 + 2);
            indices.push(off + j * 2 + 3);
            indices.push(off + j * 2 + 1);
          }
        }

        rod_index_count = indices.length - rod_index_offset;

        rod_line_index_offset = indices.length;



        for (let i = 0; i < 2; i++) {

          let r = 1 - 0.5 * i;
          for (let d = 0; d < 2; d++) {

            for (let j = 0; j <= n; j++) {
              let off = vertices.length / 6;

              let t0 = j / n;
              let t1 = (j + 1) / n;

              let y0 = r * Math.cos(t0 * Math.PI * 2);
              let z0 = r * Math.sin(t0 * Math.PI * 2);

              let y1 = r * Math.cos(t1 * Math.PI * 2);
              let z1 = r * Math.sin(t1 * Math.PI * 2);

              let l = sqrt((y1 - y0) * (y1 - y0) + (z1 - z0) * (z1 - z0));

              let ny = (y1 - y0) / l;
              let nz = (z1 - z0) / l;

              vertices.push(d);
              vertices.push(y0);
              vertices.push(z0);
              vertices.push(0);
              vertices.push(-ny);
              vertices.push(-nz);

              vertices.push(d);
              vertices.push(y0);
              vertices.push(z0);
              vertices.push(0);
              vertices.push(-2 * ny);
              vertices.push(-2 * nz);

              vertices.push(d);
              vertices.push(y1);
              vertices.push(z1);
              vertices.push(0);
              vertices.push(2 * ny);
              vertices.push(2 * nz);

              vertices.push(d);
              vertices.push(y1);
              vertices.push(z1);
              vertices.push(0);
              vertices.push(ny);
              vertices.push(nz);

              indices.push(off + 0);
              indices.push(off + 1);
              indices.push(off + 2);
              indices.push(off + 1);
              indices.push(off + 3);
              indices.push(off + 2);
            }
          }
        }
        rod_line_index_count = indices.length - rod_line_index_offset;
      }



      offset = indices.length;

      {
        let n = 16;
        let m = 64 + 2;

        let off = vertices.length / 2;

        for (let j = 0; j <= n; j++) {

          let s = j / n;

          for (let i = 0; i <= m; i++) {

            let t = (i - 1) / (m - 2);

            vertices.push(s);
            vertices.push(t);
          }
        }

        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {

            indices.push(off + j * (m + 1) + i);
            indices.push(off + j * (m + 1) + i + m + 2);
            indices.push(off + j * (m + 1) + i + 1);


            indices.push(off + j * (m + 1) + i);
            indices.push(off + j * (m + 1) + i + m + 1);
            indices.push(off + j * (m + 1) + i + m + 2);
          }
        }
      }

      simple_models["curve"] = { "index_offset": offset, "index_count": indices.length - offset }


      function make_sprocket(name, n, R, tess) {
        offset = indices.length;

        while (vertices.length % 6 != 0)
          vertices.push(0);



        let ww = 4.0;

        let off = vertices.length / 6;

        for (let i = 0; i <= n; i++) {

          let a0 = 2 * pi * i / n;

          for (let j = 0; j < tess; j++) {
            let t = j / tess;

            let a = a0 + t * 2 * pi / n;

            let ff = sin(pow(sin(a * n * 0.5), 4));
            let f = 7 * (ff - 0.5);

            let slim = ff * 1.5;

            let c = cos(a);
            let s = sin(a);

            let x = R * c
            let y = R * s;

            vertices.push((R + f) * c);
            vertices.push((R + f) * s);
            vertices.push(ww * 0.5 - slim);

            vertices.push(0);
            vertices.push(0);
            vertices.push(1);

            vertices.push((R - 5) * c);
            vertices.push((R - 5) * s);
            vertices.push(ww * 0.5);

            vertices.push(0);
            vertices.push(0);
            vertices.push(1);


            vertices.push((R + f) * c);
            vertices.push((R + f) * s);
            vertices.push(-ww * 0.5 + slim);

            vertices.push(0);
            vertices.push(0);
            vertices.push(-1);

            vertices.push((R - 5) * c);
            vertices.push((R - 5) * s);
            vertices.push(-ww * 0.5);

            vertices.push(0);
            vertices.push(0);
            vertices.push(-1);

            let nc = cos(t * pi * 2);
            nc *= nc;
            nc = nc * 0.6 + 0.4;
            let ns = sqrt(1 - nc * nc);



            vertices.push((R + f) * c);
            vertices.push((R + f) * s);
            vertices.push(ww * 0.5 - slim);

            vertices.push(c * nc + s * ns);
            vertices.push(-c * ns + s * nc);
            vertices.push(0);

            vertices.push((R + f) * c);
            vertices.push((R + f) * s);
            vertices.push(-ww * 0.5 + slim);

            vertices.push(c * nc + s * ns);
            vertices.push(-c * ns + s * nc);
            vertices.push(0);
          }

        }


        let count = n * tess;

        for (let j = 0; j < count; j++) {

          indices.push(off + j * 6 + 0);
          indices.push(off + j * 6 + 1);
          indices.push(off + j * 6 + 6);

          indices.push(off + j * 6 + 1);
          indices.push(off + j * 6 + 6);
          indices.push(off + j * 6 + 7);

          indices.push(off + j * 6 + 2);
          indices.push(off + j * 6 + 3);
          indices.push(off + j * 6 + 8);

          indices.push(off + j * 6 + 3);
          indices.push(off + j * 6 + 8);
          indices.push(off + j * 6 + 9);

          indices.push(off + j * 6 + 4);
          indices.push(off + j * 6 + 5);
          indices.push(off + j * 6 + 10);

          indices.push(off + j * 6 + 5);
          indices.push(off + j * 6 + 10);
          indices.push(off + j * 6 + 11);
        }

        simple_models[name] = { "index_offset": offset, "index_count": indices.length - offset }
      }

      make_sprocket("front_sprocket", front_sprocket_n, front_sprocket_R, 8)
      make_sprocket("rear_sprocket", rear_sprocket_n, rear_sprocket_R, 14)


      offset = indices.length;

      {
        while (vertices.length % 5 != 0)
          vertices.push(0);

        let off = vertices.length / 5;

        let dl = 10;

        let hh = 10;
        let ww = 7;


        let l = vec_len(vec_sub(sprocket, rear));
        let R = front_sprocket_R;
        let r = rear_sprocket_R;

        let ll = sqrt(l * l - (R - r) * (R - r));
        let a = atan2(R - r, ll);

        let a1 = pi / 2 + a;
        let a2 = pi / 2 - a;

        let n1 = ceil(R * a1 / dl);
        let n2 = ceil(ll / dl);
        let n3 = ceil(r * a2 / dl);

        let p0 = [R * cos(a1), R * sin(a1)];
        let p1 = [-l + r * cos(a1), r * sin(a1)];

        function add_vert(x, y, nx, ny, l) {

          vertices.push(x + nx * hh * 0.5);
          vertices.push(y + ny * hh * 0.5);
          vertices.push(-ww * 0.5);
          vertices.push(l);
          vertices.push(1);

          vertices.push(x - nx * hh * 0.5);
          vertices.push(y - ny * hh * 0.5);
          vertices.push(-ww * 0.5)
          vertices.push(l);
          vertices.push(0);

          vertices.push(x + nx * hh * 0.5);
          vertices.push(y + ny * hh * 0.5);
          vertices.push(ww * 0.5);
          vertices.push(l);
          vertices.push(1);

          vertices.push(x - nx * hh * 0.5);
          vertices.push(y - ny * hh * 0.5);
          vertices.push(ww * 0.5)
          vertices.push(l);
          vertices.push(0);

          let top_t = 0.8;
          let top_h = 0.6;

          vertices.push(x + nx * hh * 0.5 * top_h);
          vertices.push(y + ny * hh * 0.5 * top_h);
          vertices.push(-ww * 0.5);
          vertices.push(l);
          vertices.push(-2);

          vertices.push(x + nx * hh * 0.5 * top_h);
          vertices.push(y + ny * hh * 0.5 * top_h);
          vertices.push(+ww * 0.5)
          vertices.push(l);
          vertices.push(-1);

          vertices.push(x - nx * hh * 0.5 * top_h);
          vertices.push(y - ny * hh * 0.5 * top_h);
          vertices.push(-ww * 0.5);
          vertices.push(l);
          vertices.push(-2);

          vertices.push(x - nx * hh * 0.5 * top_h);
          vertices.push(y - ny * hh * 0.5 * top_h);
          vertices.push(+ww * 0.5)
          vertices.push(l);
          vertices.push(-1);
        }

        for (let i = 0; i < n1; i++) {
          let a = i / n1 * a1;
          add_vert(R * cos(a), R * sin(a), cos(a), sin(a), a * R);
        }

        for (let i = 0; i < n2; i++) {
          let t = i / n2;
          add_vert(lerp(p0[0], p1[0], t), lerp(p0[1], p1[1], t), cos(a1), sin(a1), a1 * R + t * ll);
        }

        for (let i = 0; i < n3; i++) {
          let aa = a2 * i / n3;
          let a = a1 + aa;
          add_vert(-l + r * cos(a), r * sin(a), cos(a), sin(a), a1 * R + ll + aa * r);
        }

        for (let i = 0; i < n3; i++) {
          let aa = a2 * i / n3;
          let a = pi + aa;
          add_vert(-l + r * cos(a), r * sin(a), cos(a), sin(a), a1 * R + ll + (a2 + aa) * r);
        }


        let ll2 = ll + 30;

        for (let i = 0; i < n2; i++) {
          let t = i / n2;
          add_vert(lerp(p1[0], p0[0], t), -lerp(p1[1], p0[1], t) - 30 * t * (1 - t), cos(a1), -sin(a1), a1 * R + ll + 2 * a2 * r + t * ll2);
        }

        for (let i = 0; i <= n1; i++) {
          let a = 2 * pi - (1 - i / n1) * a1;
          add_vert(R * cos(a), R * sin(a), cos(a), sin(a), a1 * R + ll + ll2 + 2 * a2 * r + +i / n1 * a1 * R);
        }


        let n = n1 + n2 + n3 + n3 + n2 + n1;

        for (let j = 0; j < n; j++) {

          indices.push(off + j * 8 + 0);
          indices.push(off + j * 8 + 1);
          indices.push(off + j * 8 + 8);

          indices.push(off + j * 8 + 1);
          indices.push(off + j * 8 + 8);
          indices.push(off + j * 8 + 9);

          indices.push(off + j * 8 + 2);
          indices.push(off + j * 8 + 3);
          indices.push(off + j * 8 + 10);

          indices.push(off + j * 8 + 3);
          indices.push(off + j * 8 + 10);
          indices.push(off + j * 8 + 11);


          indices.push(off + j * 8 + 4);
          indices.push(off + j * 8 + 5);
          indices.push(off + j * 8 + 12);

          indices.push(off + j * 8 + 5);
          indices.push(off + j * 8 + 12);
          indices.push(off + j * 8 + 13);

          indices.push(off + j * 8 + 6);
          indices.push(off + j * 8 + 7);
          indices.push(off + j * 8 + 14);

          indices.push(off + j * 8 + 7);
          indices.push(off + j * 8 + 14);
          indices.push(off + j * 8 + 15);
        }
      }

      simple_models["chain"] = { "index_offset": offset, "index_count": indices.length - offset }


      gl.bindBuffer(gl.ARRAY_BUFFER, basic_vertex_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);


      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, basic_index_buffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

      has_basic = true;
      mark_ready();
    }



    let base_vert_src =
      `
        attribute vec3 v_position;
        attribute vec3 v_normal;
        
        uniform mat4 m_mvp;
        uniform mat3 m_rot;
        
        varying vec3 n_dir;
        varying vec3 model_pos;
        
        void main(void) {
            vec3 pos = v_position;
            model_pos = pos;
            n_dir = m_rot * v_normal;
            gl_Position = m_mvp * vec4(pos, 1.0);
        }
        `;
        
        let instanced_base_vert_src =
        `
          attribute vec3 v_position;
          attribute vec3 v_normal;
          attribute vec2 v_cs;
          
          uniform mat4 m_mvp;
          uniform mat3 m_rot;
          
          varying vec3 n_dir;
          varying vec3 model_pos;
          
          void main(void) {
              vec3 pos = v_position;
              
              pos.yz = vec2(pos.y * v_cs.x + pos.z * v_cs.y,
                           -pos.y * v_cs.y + pos.z * v_cs.x);
              
              model_pos = pos;
              n_dir = m_rot * v_normal;
              gl_Position = m_mvp * vec4(pos, 1.0);
          }
          `;

    let chain_vert_src =
      `
        attribute vec3 v_position;
        attribute vec2 v_st;
        
        uniform mat4 m_mvp;
        uniform mat3 m_rot;
        
        varying vec2 st;
        
        void main(void) {
            st = v_st;
            gl_Position = m_mvp * vec4(v_position, 1.0);
        }
        `;


    let chain_frag_src =
      `
          precision mediump float;
  
          varying vec2 st;
          
          uniform float offset;
  
          void main(void) {
            
            float ll =  2.0 / 25.4;
            float t = st.x * ll + offset;
            
            float y = 0.2 * cos(3.1415926536 * 2.0 * t) + 0.8;
            
            if (st.y >= -0.5 && abs(st.y * 2.0 - 1.0) > y)
              discard;
              
            if (st.y < 0.0 && (y < 0.8 && abs(st.y + 1.5) < 0.3))
              discard;
              

            float c = 1.0;
            
            float xx = (fract(t + 0.5) - 0.5) * 2.5;
            float yy = st.y * 2.0 - 1.0;
            float d = xx * xx + yy * yy;
            
            if (d < 0.15)
              c = 0.2;
              
            if (d > 1.0 && fract(t * 0.5) > 0.5)
              c = 0.8;
              
            if (st.y < -0.5 && abs(st.y + 1.5) < 0.3)
              c = 0.6;
              
              c *= 0.7;
            
              
            gl_FragColor = vec4(c, c, c, 1.0);
          }
        `;


    let skinned_vert_src =
      `
      attribute vec3 v_position;
      attribute vec3 v_normal;
      attribute vec3 v_weights;
      attribute vec3 v_indices;
      
      uniform mat4 m_mvp;
      uniform mat3 m_rot;
      uniform mat4 m_skin[14];
      
      varying vec3 n_dir;
      
    
      
      void main(void) {
          vec4 pos = vec4(v_position, 1.0);

          
          mat4 m = m_skin[int(v_indices[0])] * v_weights[0] +
                   m_skin[int(v_indices[1])] * v_weights[1] +
                   m_skin[int(v_indices[2])] * v_weights[2];
          
          pos = m * pos;

          
          vec4 norm = m * vec4(v_normal, 0.0);
           
          n_dir = m_rot * norm.xyz;
          gl_Position = m_mvp * pos;
      }
      `;

    let oval_tube_vert_src =
      `
            attribute vec3 v_position;
            attribute vec3 v_normal;
            
            uniform mat4 m_mvp;
            uniform mat3 m_rot;
            
            uniform vec4 r0r1;
            uniform float offset;
            
            varying vec3 n_dir;
            varying vec3 model_pos;
            
            void main(void) {
                vec3 pos = v_position;
                float t = pos.z;
                
                pos.x *= mix(r0r1.x, r0r1.z, t);
                pos.y *= mix(r0r1.y, r0r1.w, t);
                pos.y += offset * t * t * t;
      
                model_pos = pos;
      
                n_dir = m_rot * v_normal;
                gl_Position = m_mvp * vec4(pos, 1.0);
            }
            `;

    let flex_tube_vert_src =
      `
            attribute vec3 v_position;
            attribute vec3 v_normal;
            
            uniform mat4 m_mvp;
            uniform mat3 m_rot;
            
            uniform vec4 params;
            
            varying vec3 n_dir;
            varying vec3 model_pos;
            
            void main(void) {
                vec3 pos = v_position;
                float x = sin(pos.z * 3.1415926536);
                pos.xy *= params.w;
                pos.z *= params.z;

                model_pos = pos;

                pos.xy += x*x*params.xy;
                n_dir = m_rot * v_normal;
                gl_Position = m_mvp * vec4(pos, 1.0);
            }
            `;

    let bezier_curve_vert_src =
      `
      attribute vec2 v_st;
      
      uniform vec4 v_x;
      uniform vec4 v_y;
      uniform vec4 v_z;
      uniform vec2 st_scale;
      
      uniform mat4 m_mvp;
      uniform mat3 m_rot;
      
      uniform float radius;
      
      varying vec3 n_dir;
      varying vec2 st;
      varying vec4 color;
                  
      float b(vec4 v, float t, float nt) {
          float s = 0.0;
          s += v.x*nt*nt*nt;
          s += v.y*3.0*t*nt*nt;
          s += v.z*3.0*t*t*nt;
          s += v.w*t*t*t;
          return s;
      }
      
      float dbdt(vec4 v, float t, float nt) {
          return 3.0*(v.y - v.x)*nt*nt +
                 6.0*(v.z - v.y)*nt*t + 
                 3.0*(v.w - v.z)*t*t; 
      }
      
      
      void main(void) {
      
          float t = v_st.y;
          float t_clamp = max(0.0, min (1.0, t));
          float rr = t != t_clamp ? 0.0 : radius;
          t = t_clamp;
          float nt = 1.0 - t;
                      
          vec3 pos = vec3(b(v_x, t, nt), b(v_y, t, nt), b(v_z, t, nt));
          vec3 tan = vec3(dbdt(v_x, t, nt), dbdt(v_y, t, nt), dbdt(v_z, t, nt));
          
          tan = normalize(tan);
          
          vec3 nor = normalize(vec3(1.0, 1.0, 1.0));

          vec3 bnor = normalize(cross(tan, nor));
          nor = normalize(cross(tan, bnor));
      
          float c = cos(v_st.x * 2.0 * 3.1415926536);
          float s = sin(v_st.x * 2.0 * 3.1415926536);
      
          vec3 n =  c*nor + s*bnor;
          pos += n*rr;
          n_dir = m_rot*n;
          st = v_st * st_scale;
                      
          gl_Position = m_mvp * vec4(pos, 1.0);
      }
      `;

    let fem_vert_src =
      `
        attribute vec3 v_position;
        attribute vec3 v_normal;
        
        uniform mat4 m_mvp;
        uniform mat3 m_rot;
        
        uniform vec3 p0;
        uniform vec3 p1;
        uniform vec3 r0;
        uniform vec3 r1;
        uniform vec4 size;
        
        uniform vec3 forces;
        uniform vec3 moments;
        
        varying vec3 n_dir;
        varying float stress;
        
        void main(void) {
            
            float len = size.x;
            float r = size.y;
            
            vec3 pos = v_position;
            pos = pos.zxy;
            
            float t = pos.x;
            
            float h00 = 2.0*t*t*t - 3.0*t*t + 1.0;
            float h10 = t*t*t - 2.0*t*t + t;
            float h01 = -2.0*t*t*t + 3.0*t*t;
            float h11 = t*t*t - t*t;
            
            float dh00 = 6.0*t*t - 6.0*t;
            float dh10 = 3.0*t*t - 4.0*t + 1.0;
            float dh01 = -dh00;
            float dh11 = 3.0*t*t - 2.0*t;
            
            
            vec3 d = vec3(0.0);
            
            d += p0 * h00;
            d += p1 * h01;
            
            float rz = len * (h10 * r0.z + h11 * r1.z);
            float ry = len * (h10 * r0.y + h11 * r1.y);
            
            d.y += rz;
            d.z -= ry;
            
            vec3 tang;
            tang.x = 1.0;
            tang.y = dh00 * p0.y/len + dh10 * r0.z + dh01 * p1.y/len + dh11 * r1.z;
            tang.z = dh00 * p0.z/len - dh10 * r0.y + dh01 * p1.z/len - dh11 * r1.y;
            
            tang = normalize(tang);
            
            vec3 norm = vec3(0.0, 1.0, 0.0);
            vec3 bnorm = normalize(cross(tang, norm));
            norm = cross(bnorm, tang);
            
            pos.x = 0.0;
            pos.zy *= r;
            
            vec3 tmp = pos;
            
            pos.x = dot(tmp, vec3(tang.x, norm.x, bnorm.x));
            pos.y = dot(tmp, vec3(tang.y, norm.y, bnorm.y));
            pos.z = dot(tmp, vec3(tang.z, norm.z, bnorm.z));

            vec3 nor = normalize(pos);

            tmp.x = t*len;

            pos.x += tmp.x;
            
            pos += d;

            
            float inv_I = size.w;
            float inv_A = size.z;
                        
            float sigma = -forces.x * inv_A;
            sigma -= (moments.y + tmp.x * forces.z) * tmp.z * inv_I;
            sigma += (moments.z - tmp.x * forces.y) * tmp.y * inv_I;
            
            float tau = moments.x * length(v_position.xy);

            stress = sqrt(sigma*sigma + 3.0 * (tau*tau)) * 1e-6 * (1.0/450.0 * 2.0);

                
            n_dir = m_rot * nor;
            gl_Position = m_mvp * vec4(pos, 1.0);
        }
      `

    let fem_frag_src =
      `
                precision mediump float;
                
                uniform sampler2D lut;

                varying float stress;
                            
            void main(void) {
              
                mediump vec3 color = texture2D(lut, vec2(stress, 0.5)).rgb;

                gl_FragColor = vec4(color, 1.0);
            }
            `;


    let beam_stress_frag_src =
      `
                 precision mediump float;
                 
                 uniform float scale;
       
                 varying vec3 base_pos;
                          
             void main(void) {
               
                vec3 c0 = vec3(0.16, 0.50, 0.87);
                vec3 c1 = vec3(1.00, 0.58, 0.11);
                vec3 mid = vec3(0.8);
                
                vec3 color = base_pos.z > 0.0 ? c0 : c1;
                color = mix(mid, color, abs(base_pos.z * scale) * (scale > 0.0 ? 1.0 : base_pos.x));
     
                 gl_FragColor = vec4(color, 1.0);
             }
             `;


    let model_pos_vert_src =
      `
            attribute vec3 v_position;
            attribute vec3 v_normal;
            
            uniform mat4 m_mvp;
            uniform mat3 m_pos;
            uniform mat3 m_rot;
            
            varying vec3 n_dir;
            varying vec3 model_pos;
            
            void main(void) {
                model_pos = m_pos * v_position;
                n_dir = m_rot * v_normal;
                gl_Position = m_mvp * vec4(v_position, 1.0);
            }
            `;


    let transform_vert_src =
      `
              attribute vec3 v_position;
              attribute vec3 v_normal;
              
              uniform mat4 m_mvp;
              uniform mat3 m_rot;
              
              varying vec3 n_dir;
              varying vec3 model_pos;
              varying vec3 base_pos;
              
              void main(void) {
                  base_pos = base_transform_position(v_position);
                  model_pos = transform_position(base_pos);

                  n_dir = m_rot * v_normal;
                  gl_Position = m_mvp * vec4(model_pos, 1.0);
              }
        `;



    let color_frag_src =
      `
        precision mediump float;

        varying vec3 n_dir;
        varying vec3 model_pos;

        uniform vec4 color;
        uniform float normal_f;

        void main(void) {
                   
            vec4 c = color;
            
            float f = mix(1.0, abs(normalize(n_dir).z), normal_f);
            
            c.rgb *= sqrt(f);
            
            gl_FragColor = c;
        }
`;


    let dashed_frag_src =
      `
      precision mediump float;

      varying vec3 n_dir;
      varying vec3 model_pos;

      uniform vec4 color;
      uniform vec4 params;
      uniform float normal_f;


      void main(void) {
          
          vec4 c = color;
          
          float f = mix(1.0, abs(normalize(n_dir).z), normal_f);
          
          c.rgb *= sqrt(f);
          
          if (dot(model_pos, params.xyz) < params.w)
            discard;
         
          if (!gl_FrontFacing) {
           float a = gl_FragCoord.x + gl_FragCoord.y * (params.w == 0.0 ? 1.0 : -1.0);
           a = fract(a*0.02);
           a = smoothstep(0.0, 0.1, a) - smoothstep(0.6, 0.7, a);
           a = 0.5 + 0.4*a;
           c.rgb = color.rgb * a; 
          }

          gl_FragColor = c;
      }
    `;

    let feather_disc_frag_src =
      `
        precision mediump float;

        varying vec3 n_dir;
        varying vec3 model_pos;

        uniform vec4 color;
        uniform vec4 params;
        uniform float normal_f;

        void main(void) {
            
            
            
            vec2 p = model_pos.yz - vec2(0.5);
            
            vec2 pp = p + params.xy;
            pp = fract(pp * params.z);
            
            float h = pp.x > 0.5 != pp.y > 0.5 ? 1.0 : 0.4;
            
            float a = 1.0 - smoothstep(0.25 - params.w, 0.25, dot(p,p));
           
           a *= h;
            
            
            gl_FragColor = color * a;
        }
        `;

    let torus_frag_src =
      `
      precision mediump float;

      varying vec3 n_dir;
      varying vec3 model_pos;

      uniform vec4 color;
      uniform vec4 params;
      
      
      float hash (vec2 st) {
          return fract(sin(dot(st,
                               vec2(13.54353, 83.8981)))
                       * 43758.5453123);
      }
      
      float noise(in vec2 x)
      {
          vec2 i = floor(x);
          vec2 f = x-i;
          
          float v = mix(mix(hash(i+vec2(0,0)), 
                         hash(i+vec2(1,0)),f.x),
                     mix(hash(i+vec2(0,1)), 
                         hash(i+vec2(1,1)),f.x),
                     f.y);
          return v;
      }

      void main(void) {
          
          vec2 p = model_pos.yz - vec2(0.5);
          float R = params.x;
          float r = params.y;
          
          float d = R + sqrt(r*r - p.x*p.x);
          float h = R + r - sqrt(d*d - p.y*p.y);
          
          float n = noise(p*400.0);
          float nn = n*n;
          nn *= nn;
          nn *= nn;
          nn *= nn;
          h += 0.001 * n;
          
          
          float a = 1.0 - smoothstep(params.z, params.z + 0.001, h)-nn;
          
          if (abs(p.x) > r)
            a = 0.0;
            
          if (abs(p.y) > d)
            a = 0.0;
         
          
          gl_FragColor = color * a;
      }
      `;

    let human_frag_src =
      `
          precision mediump float;
  
          varying vec3 n_dir;
          varying vec3 model_pos;
  
          uniform vec4 color;
          uniform float normal_f;
  
          void main(void) {
              
              
              vec4 c = color;
              
                          
              vec3 nn = normalize(n_dir);
              
              float f = mix(1.0, abs(nn.z), 0.5);
                            
              f = abs(nn.z) > 0.7 ? 1.0 : abs(nn.z) > 0.3 ? 0.9 : 0.75;

               c.rgb *= f;
            
              
              gl_FragColor = c;
          }
  `;

    let handlebar_frag_src =
      `
          precision mediump float;
  
          varying vec3 n_dir;
          varying vec2 st;

          uniform vec4 color;
  
          uniform float normal_f;
  
          void main(void) {
              
              float d = sin(st.x + st.y);                    
              float h = d > 0.8 ? 0.7 : 1.0;
              
              float f = mix(1.0, abs(normalize(n_dir).z), 0.5);
              
              f *= h;
              
              f = sqrt(f);
                            
                            
               vec4 c = color;
               c.rgb *= f;

              gl_FragColor = c;
          }
  `;

    let parallax_hole_frag_src =
      `
          precision mediump float;
  
          varying vec3 n_dir;
          varying vec3 model_pos;
  
          uniform highp mat4 m_inv_mvp;
          
          uniform vec4 color;
          uniform float normal_f;
          
          uniform vec4 params;
  
          void main(void) {
            
              vec4 start4 = m_inv_mvp * vec4(gl_FragCoord.xy, 0.0, 1.0);
              vec3 start = start4.xyz/start4.w;
              
              
              vec3 n = normalize(start - model_pos);

   
              vec2 p = model_pos.yz*2.0 - vec2(1.0);
              
              
              float r0 = sqrt(dot(p,p));
              
              p -= n.yz * params.x;
              
              float r1 = sqrt(dot(p,p));
              
              float a1 = smoothstep(params.y - 0.05, params.y, r1);
              float a0 = smoothstep(params.y - 0.05, params.y, r0);
              float a = min(1.0, a0 + a1 + params.z);
              
              vec4 c = color;
                            
              
              float dd = params.z != 0.0 && a0 == 0.0 ? min(1.0, r1/params.y) : 1.0;
              float f = mix(1.0, abs(normalize(n_dir).z), 0.5);
              
              f *= (0.8 + 0.2 * a0);
              f *= dd * dd * 0.6;
              c.rgb *= sqrt(f);              
              
              gl_FragColor = c*a;
              
              if (r0 > 1.0)
                discard;
          }
          `;

    let background_frag_src =
      `
      precision mediump float;

      varying vec3 n_dir;
      varying vec3 model_pos;

      uniform highp mat4 m_inv_mvp;
      
      uniform vec4 color;
      uniform float normal_f;
      
      uniform vec4 params;
      uniform vec4 params2;

      void main(void) {
                                        
        
        float x = model_pos.z * params.z;
        float y = model_pos.y * params.z;
        vec3 c = vec3(0.0);
        float rot = params.w * 2.0 + (model_pos.z + 0.5) * 3.1415926536;
        rot *= params2.y;
        
        float front = cos(rot) * 0.5 + 0.5;
        front *= front;
        front *= front;
        
        front = 1.0 - front * params2.y;
        
        
        c = mix(vec3(1.0), vec3(0.8196, 0.9098, 0.9608), smoothstep(0.2, 1.0, y));
        
        float x0 = params.x * 0.5/16.0;
        float y0 = params.y + (0.20 + sin(x0 + 5.0 + x * 5.0 + rot) * 0.05) * front;
        
        float x1 = params.x * 0.5/4.0;
        float y1 = params.y + (0.12 + sin(x1 + 2.0 + x * 4.0 + rot) * 0.05) * front;
      
        float x2 = params.x * 0.5;
        float y2 = params.y +( 0.06 + sin(x2 + 1.0 + x * 3.0 +rot) * 0.03) * front;
        
        
        
     
    
        
        float threshold = 0.003;
        
        c = mix(vec3(0.854, 0.894, 0.807), c, smoothstep(y0, y0 + threshold, y));
        c = mix(vec3(0.721, 0.768, 0.682), c, smoothstep(y1, y1 + threshold, y));
        c = mix(vec3(0.596, 0.650, 0.552), c, smoothstep(y2, y2 + threshold, y));
        c = mix(vec3(0.168, 0.168, 0.168), c, smoothstep(params.y, params.y + threshold, y));
        c = mix(vec3(0.407, 0.403, 0.423), c, smoothstep(params.y - 0.002, params.y - 0.002 + threshold, y));

        float h = smoothstep(params.y - 0.010, params.y - 0.010 + threshold, y) -
                  smoothstep(params.y - 0.002, params.y - 0.002 + threshold, y);
                  
        float w = max(0.0, min(1.0, 60.0 * sin((params.x + x) * 5.0) - 15.0));
        c = mix(c, vec3(0.701, 0.513, 0.2), h * w * params2.x);
        
        gl_FragColor = vec4(c, 1.0);
      }
      `;


    // based on: https://www.shadertoy.com/view/wl3czM

    let wood_frag_src =
      `
                    precision mediump float;
            
                    varying vec3 n_dir;
                    varying vec3 model_pos;
            
                    uniform vec4 color;
                    uniform float normal_f;
                    
                    
       float n31(vec3 p) {
           const vec3 s = vec3(7, 157, 113);
           vec3 ip = floor(p);
           p = p - ip;
           vec4 h = vec4(0, s.yz, s.y + s.z) + dot(ip, s);
           h = mix(fract(sin(h) * 43.5453), fract(sin(h + s.x) * 43.5453), p.x);
           h.xy = mix(h.xz, h.yw, p.y);
           return mix(h.x, h.y, p.z);
       }
                    
                    float n11(float p) {
                        float ip = floor(p);
                        p = fract(p);
                        vec2 h = fract(sin(vec2(ip, ip + 1.) * 12.3456) * 43.5453);
                        return mix(h.x, h.y, p * p * (3. - 2. * p));
                    }
                    
                    float wood(vec3 p) {
                        float w = n11(n31(p) * 25.);
                        return 1.0 -  w * w;
                    }
            
                    void main(void) {
                        
                        vec4 c = color;
                        
                        float f = mix(1.0, max(0.0, normalize(n_dir).z), 0.5);
                        f *= 0.85 + 0.15 * wood(model_pos * 0.01);
                        
                        c.rgb *= sqrt(f);
                        
                        gl_FragColor = c;
                    }
            `;


    let no_op_vert_transform = `
                vec3 base_transform_position(vec3 p) {
                    return p;
                }
                vec3 transform_position(vec3 p) {
                    return p;
                }
                vec3 transform_line_position(vec3 p, vec3 n) {
                    return p + n;
                }
            `
            
    let instanced_vert_transform = `
    
             attribute vec2 v_cs;

                vec3 base_transform_position(vec3 p) {
                    p.yz = vec2(p.y * v_cs.x + p.z * v_cs.y,
                               -p.y * v_cs.y + p.z * v_cs.x);
                    return p;
                }
                vec3 transform_position(vec3 p) {
                    return p;
                }
                vec3 transform_line_position(vec3 p, vec3 n) {
                    return base_transform_position(p + n);
                }
            `            

    let arrow_vert_transform = `
        
                uniform vec4 params;
                
                vec3 base_transform_position(vec3 p) {
                    return p;
                }
                
                vec3 transform_position(vec3 p) {
                  if (p.z >= 35.0)
                    p.z += params.x;
                  
                  return p;
                }
                vec3 transform_line_position(vec3 p, vec3 n) {
                  return transform_position(p + n);
                }
            `

    let deflect_vert_transform = `
            
            uniform mat3 m_pos;

            uniform vec4 params;
            
            vec3 base_transform_position(vec3 p) {
                return p;
            }
            
            vec3 transform_position(vec3 p) {
              
                p = m_pos * p;
                  float a = atan(p.y, p.z);
                  float f = exp(-2.0*a*a)*(-a*a+1.0);
                  
                  p.yz *= 1.0 - f * params.x + params.y;

                return p;
            }
            
            vec3 transform_line_position(vec3 p, vec3 n) {
                return transform_position(p + n);
            }

            `

    let beam_vert_transform = `
                    
            uniform vec4 bhlf;
            
            vec3 base_transform_position(vec3 p) {
              return p;
            }
            
            vec3 transform_position(vec3 p) {
              
            float fi = (p.x - 0.5) * bhlf.z / bhlf.w; 
            
            float c = cos(fi);
            float s = sin(fi);
            
            float r = bhlf.w + p.z * bhlf.y;
            p.x = r * s;
            p.z = r * c - bhlf.w;
            p.y *= bhlf.x;            
            
            return p;
            }
            
            vec3 transform_line_position(vec3 p, vec3 n) {
                
                return transform_position(p + n*(1.0/64.0));        
              }
            `

    let rod_vert_transform = `
                    
            uniform vec4 rRlf;
            
            vec3 base_transform_position(vec3 p) {
              p.zy *= dot(p.zy, p.zy) < 0.5 ? rRlf.x : rRlf.y;
              return p;
            }
            
            vec3 transform_position(vec3 p) {
              
            float fi = (p.x - 0.5) * rRlf.z / rRlf.w; 
            
            float c = cos(fi);
            float s = sin(fi);
            
            float r = rRlf.w + p.z;
            p.x = r * s;
            p.z = r * c - rRlf.w;
            
            return p;
            }
            
            vec3 transform_line_position(vec3 p, vec3 n) {
                
                return transform_position(base_transform_position(p + n*(1.0/64.0)));        
              }
            `

    let twist_vert_transform = `
                    
            uniform vec4 rRlf;
            
            vec3 base_transform_position(vec3 p) {
              p.zy *= dot(p.zy, p.zy) < 0.5 ? rRlf.x : rRlf.y;
              return p;
            }
            
            vec3 transform_position(vec3 p) {
              
              float fi = (p.x - 0.5) * rRlf.w; 
              
              float c = cos(fi);
              float s = sin(fi);
              
              vec3 tmp = p;
              p.y = tmp.y * c + tmp.z * s;
              p.z = tmp.y * -s + tmp.z * c;
              p.x -= 0.5;
              p.x *= rRlf.z; 
              
              return p;

            }
            
            vec3 transform_line_position(vec3 p, vec3 n) {
                
                return transform_position(base_transform_position(p + n*(1.0/64.0)));        
              }
            `

    let twist_frag_src =
      `
                       precision mediump float;
                       
                       uniform highp vec4  rRlf;

                       uniform float scale;
             
                       varying vec3 base_pos;
                       varying vec3 n_dir;
                       
                       uniform vec4 color;

                       
                              
                   void main(void) {
                   
                   float a = atan(base_pos.y, base_pos.z);
                   
                   float c = fract(6.0 *a/(2.0*3.1415926536));
                   float d = (0.1 + 0.2 * (1.0 - abs(n_dir.z))) * 0.01 / rRlf.y;
                  c = smoothstep(0.0, 0.0 + d, c) - smoothstep(0.8, 0.8 + d, c);
                  c = c * 0.5 + 0.5;
                       gl_FragColor = vec4(color.rgb*c, color.a);
                   }
                   `;



    let twist_stress_frag_src =
      `
                 precision mediump float;
                 
                 uniform float scale;
       
                 varying vec3 base_pos;
                 varying vec3 n_dir;

                 uniform sampler2D lut;
     
                        
             void main(void) {
                              
                                  
                mediump vec3 color = texture2D(lut, vec2(scale * length(base_pos.yz), 0.5)).rgb;
     
     float a = atan(base_pos.y, base_pos.z);
      
      float c = fract(10.0 *a/(2.0*3.1415926536));
      float d = 0.1 + 0.2 * (1.0 - abs(n_dir.z));
     c = smoothstep(0.0, 0.0 + d, c) - smoothstep(0.7, 0.7 + d, c);
     c = 0.7 + c*0.3;
     color *= c;
      
                 gl_FragColor = vec4(color, 1.0);
             }
             `;

    let line_vert_src =
      `
            attribute vec3 v_position;
            attribute vec3 v_normal;
            
            varying vec3 model_pos;

            uniform mat4 m_mvp;
            uniform vec4 line_arg;
            
            void main(void) {
            
                vec3 normal = v_normal;
                float ll = dot(normal, normal);
            
                float perp_sign = ll > 1.5 ? 1.0 : -1.0;
                normal *= ll > 1.5 ? 0.5 : 1.0;
            
                vec4 pos0 = m_mvp * vec4(transform_line_position(v_position, vec3(0)), 1.0);
                pos0.xyz *= (1.0 / max(0.00001, pos0.w));
                
                vec4 pos1 = m_mvp * vec4(transform_line_position(v_position, normal), 1.0);
                pos1.xy *= (1.0 / max(0.00001, pos1.w));

                vec2 ss_normal = normalize((pos1 - pos0).xy);
                vec2 ss_perp = vec2(ss_normal.y, -ss_normal.x) * perp_sign;
            
                vec4 position = pos0;
                
                vec2 delta = (ss_perp) * line_arg.x;
                delta.x *= line_arg.z;

                position.xy += delta;
                position.z += line_arg.y;
                position.w = 1.0;

                gl_Position = position;
            }
            `;


    let line_frag_src =
      `
            precision mediump float;
            
            uniform vec4 color;
            
            void main(void) {
            
                gl_FragColor = color;
            }
            `;


    let dashed_line_frag_src =
      `
                    precision mediump float;
                        
                        
                        varying vec3 model_pos;


                    uniform vec4 color;
                    uniform vec4 params;
            
            
                    void main(void) {
                                                
                        if (dot(model_pos, params.xyz) < 0.0)
                          discard;
                       
            
                        gl_FragColor = color;
                    }
            `;

    let tire_vert_src =
      `
      attribute vec3 v_position;
      attribute vec3 v_normal;
      
      uniform mat4 m_mvp;
      uniform mat3 m_rot;
      
      uniform vec4 params;
      
      varying vec3 n_dir;
      varying vec3 model_pos;
      
      vec3 deflection(float a) {
        a = max(0.0, a + params.x);
        
        float d =  a * params.y;
        float x = 1.0 - smoothstep((2.0 - 3.0*abs(params.z)) * params.x, 2.3 * params.x, a);
        
        return vec3(params.z * d * x, 0.0, 0.0);  
      }
      
      
      void main(void) {
          vec3 pos = v_position;
          float a = atan(pos.z, pos.y);
          float r = length(pos.zy);
          
          pos += deflection(a) * smoothstep(params.y - 15.0, params.y, r);
          model_pos = pos;
          n_dir = m_rot * v_normal;
          gl_Position = m_mvp * vec4(pos, 1.0);
      }
      `;


    let flat_shader = new Shader(gl,
      base_vert_src,
      color_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "color", "normal_f"]);

    let instanced_flat_shader = new Shader(gl,
      instanced_base_vert_src,
      color_frag_src,
      ["v_position", "v_normal", "v_cs"],
      ["m_mvp", "m_rot", "color", "normal_f"]);

    let dashed_shader = new Shader(gl,
      base_vert_src,
      dashed_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "color", "normal_f", "params"]);

    let feather_disc_shader = new Shader(gl,
      base_vert_src,
      feather_disc_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "color", "normal_f", "params"]);

    let chain_shader = new Shader(gl,
      chain_vert_src,
      chain_frag_src,
      ["v_position", "v_st"],
      ["m_mvp", "m_rot", "offset"]);

    let torus_shader = new Shader(gl,
      base_vert_src,
      torus_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "color", "params"]);

    let tire_shader = new Shader(gl,
      tire_vert_src,
      color_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "color", "normal_f", "params"]);


    let parallax_hole_shader = new Shader(gl,
      base_vert_src,
      parallax_hole_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "m_inv_mvp", "params", "color", "normal_f"]);

    let background_shader = new Shader(gl,
      base_vert_src,
      background_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "params", "params2"]);


    let skinned_shader = new Shader(gl,
      skinned_vert_src,
      human_frag_src,
      ["v_position", "v_normal", "v_weights", "v_indices"],
      ["m_mvp", "m_rot", "m_skin", "color", "normal_f"]);

    let deflect_shader = new Shader(gl,
      deflect_vert_transform + transform_vert_src,
      color_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "m_pos", "params", "color", "normal_f"]);

    let deflect_line_shader = new Shader(gl,
      deflect_vert_transform + line_vert_src,
      line_frag_src, ["v_position", "v_normal"], ["m_mvp", "m_pos", "line_arg", "color", "params"]);


    let oval_tube_shader = new Shader(gl,
      oval_tube_vert_src,
      color_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "r0r1", "offset", "color", "normal_f"]);

    let flex_tube_shader = new Shader(gl,
      flex_tube_vert_src,
      color_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "params", "color", "normal_f"]);

    let flex_tube_wood_shader = new Shader(gl,
      flex_tube_vert_src,
      wood_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "params", "color", "normal_f"]);

    let bezier_curve_shader = new Shader(gl,
      bezier_curve_vert_src,
      color_frag_src,
      ["v_st"],
      ["m_mvp", "m_rot", , "v_x", "v_y", "v_z", "st_scale", "radius", "normal_f", "color"]);

    let handlebar_shader = new Shader(gl,
      bezier_curve_vert_src,
      handlebar_frag_src,
      ["v_st"],
      ["m_mvp", "m_rot", , "v_x", "v_y", "v_z", "st_scale", "radius", "normal_f", "color"]);

    let fem_shader = new Shader(gl,
      fem_vert_src,
      fem_frag_src,
      ["v_position"],
      ["m_mvp", "m_rot", "p0", "p1", "r0", "r1", "size", "forces", "moments", "lut"]);

    let plain_fem_shader = new Shader(gl,
      fem_vert_src,
      color_frag_src,
      ["v_position"],
      ["m_mvp", "m_rot", "p0", "p1", "r0", "r1", "size", "forces", "moments", "lut", "color", "normal_f"]);



    let beam_shader = new Shader(gl,
      beam_vert_transform + transform_vert_src,
      color_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "bhlf", "color", "normal_f"]);

    let beam_stress_shader = new Shader(gl,
      beam_vert_transform + transform_vert_src,
      beam_stress_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "bhlf", "scale"]);

    let rod_stress_shader = new Shader(gl,
      rod_vert_transform + transform_vert_src,
      beam_stress_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "rRlf", "scale"]);

    let rod_twist_shader = new Shader(gl,
      twist_vert_transform + transform_vert_src,
      twist_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "rRlf", "scale", "color"]);


    let rod_twist_stress_shader = new Shader(gl,
      twist_vert_transform + transform_vert_src,
      twist_stress_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "rRlf", "scale", "lut"]);



    let beam_line_shader = new Shader(gl,
      beam_vert_transform + line_vert_src,
      line_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "bhlf", "color", "line_arg"]);



    let rod_line_shader = new Shader(gl,
      rod_vert_transform + line_vert_src,
      line_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "rRlf", "color", "line_arg"]);


    let wood_shader = new Shader(gl,
      model_pos_vert_src,
      wood_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "m_pos", "color", "normal_f"]);


    let simple_line_shader = new Shader(gl,
      no_op_vert_transform + line_vert_src,
      line_frag_src, ["v_position", "v_normal"], ["m_mvp", "m_pos", "line_arg", "color"]);
      
    let simple_instanced_line_shader = new Shader(gl,
      instanced_vert_transform + line_vert_src,
      line_frag_src, ["v_position", "v_normal", "v_cs"], ["m_mvp", "m_pos", "line_arg", "color"]);


    let dashed_line_shader = new Shader(gl,
      no_op_vert_transform + line_vert_src,
      dashed_line_frag_src, ["v_position", "v_normal"], ["m_mvp", "m_pos", "line_arg", "color", "params"]);


    let arrow_shader = new Shader(gl,
      arrow_vert_transform + transform_vert_src,
      color_frag_src,
      ["v_position", "v_normal"],
      ["m_mvp", "m_rot", "color", "normal_f", "params"]);

    let arrow_line_shader = new Shader(gl,
      arrow_vert_transform + line_vert_src,
      line_frag_src, ["v_position", "v_normal"], ["m_mvp", "m_pos", "params", "line_arg", "color"]);




    let prev_width, prev_height;

    let viewport_w = 0;
    let viewport_h = 0;


    function setup_base_bindings(shader, mvp, rot) {
      gl.bindBuffer(gl.ARRAY_BUFFER, basic_vertex_buffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, basic_index_buffer);

      gl.enableVertexAttribArray(shader.attributes["v_position"]);
      gl.vertexAttribPointer(shader.attributes["v_position"], 3, gl.FLOAT, false, 24, 0);
      gl.enableVertexAttribArray(shader.attributes["v_normal"]);
      gl.vertexAttribPointer(shader.attributes["v_normal"], 3, gl.FLOAT, false, 24, 12);

      gl.uniformMatrix4fv(shader.uniforms["m_mvp"], false, mat4_transpose(mvp));
      gl.uniformMatrix3fv(shader.uniforms["m_rot"], false, mat3_invert(rot));
    }

    this.begin = function(width, height) {

      width *= scale;
      height *= scale;

      if (width != prev_width || height != prev_height) {
        canvas.width = width;
        canvas.height = height;
        prev_width = width;
        prev_height = height;
      }

      gl.disable(gl.SCISSOR_TEST);

      gl.viewport(0, 0, width, height);

      gl.disable(gl.BLEND);
      gl.depthMask(true);
      gl.depthFunc(gl.LEQUAL);
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.disable(gl.CULL_FACE);

      gl.enable(gl.DEPTH_TEST);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);


      viewport_w = Math.round(width);
      viewport_h = Math.round(height);
    }

    this.viewport = function(x, y, w, h) {
      gl.viewport(x * scale, y * scale, w * scale, h * scale);
    }


    this.finish = function() {
      gl.flush();
      return gl.canvas;
    }

    this.draw_simple_mesh = function(name, mvp, rot, color, mode, params) {
      let mesh = simple_models[name];

      if (force_gray)
        color = gray_bike_color;

      if (color[3] < 1.0) {
        gl.enable(gl.BLEND);
        gl.disable(gl.CULL_FACE);
        gl.depthMask(false);
      }

      let shader = flat_shader;

      if (mode === "tire")
        shader = tire_shader;

      gl.useProgram(shader.shader);

      setup_base_bindings(shader, mvp, rot);

      gl.uniform4fv(shader.uniforms["color"], color);
      gl.uniform1f(shader.uniforms["normal_f"], 0.5);

      if (mode === "tire")
        gl.uniform4fv(shader.uniforms["params"], params);

      gl.drawElements(gl.TRIANGLES, mesh.index_count, gl.UNSIGNED_INT, mesh.index_offset * 4);
    }

    this.draw_chain = function(mvp, rot, offset) {
      let mesh = simple_models["chain"];

      let shader = chain_shader;

      gl.useProgram(shader.shader);

      gl.bindBuffer(gl.ARRAY_BUFFER, basic_vertex_buffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, basic_index_buffer);

      gl.enableVertexAttribArray(shader.attributes["v_position"]);
      gl.vertexAttribPointer(shader.attributes["v_position"], 3, gl.FLOAT, false, 20, 0);
      gl.enableVertexAttribArray(shader.attributes["v_st"]);
      gl.vertexAttribPointer(shader.attributes["v_st"], 2, gl.FLOAT, false, 20, 12);


      gl.uniformMatrix4fv(shader.uniforms["m_mvp"], false, mat4_transpose(mvp));
      gl.uniformMatrix3fv(shader.uniforms["m_rot"], false, mat3_invert(rot));
      gl.uniform1f(shader.uniforms["offset"], offset);


      gl.drawElements(gl.TRIANGLES, mesh.index_count, gl.UNSIGNED_INT, mesh.index_offset * 4);
    }

    this.draw_oval_tube = function(mvp, rot, r0r1, offset, color) {

      let mesh = simple_models["flex_tube"];

      if (force_gray)
        color = gray_bike_color;

      gl.useProgram(oval_tube_shader.shader);

      setup_base_bindings(oval_tube_shader, mvp, rot);

      gl.uniform4fv(oval_tube_shader.uniforms["color"], color);
      gl.uniform4fv(oval_tube_shader.uniforms["r0r1"], r0r1);
      gl.uniform1f(oval_tube_shader.uniforms["normal_f"], 0.5);
      gl.uniform1f(oval_tube_shader.uniforms["offset"], offset);

      gl.drawElements(gl.TRIANGLES, mesh.index_count - tube_tess * 12, gl.UNSIGNED_INT, (mesh.index_offset + tube_tess * 6) * 4);
    }


    this.draw_quad = function(mvp, rot, color, mode, params = [0, 0, 0, 0], params2 = [0, 0, 0, 0]) {

      let mesh = simple_models["quad"];

      let shader = feather_disc_shader;

      if (mode === "parallax_hole") {
        shader = parallax_hole_shader;
      } else if (mode === "background") {
        shader = background_shader;
      } else if (mode === "torus") {
        shader = torus_shader;
      } else if (mode === "plain") {
        shader = flat_shader;

        if (color[3] != 1) {
          gl.enable(gl.BLEND);
          gl.disable(gl.CULL_FACE);
          gl.depthMask(false);
        }
      } else {
        gl.enable(gl.BLEND);
        gl.disable(gl.CULL_FACE);
        gl.depthMask(false);
      }

      gl.useProgram(shader.shader);

      setup_base_bindings(shader, mvp, rot);

      gl.uniform4fv(shader.uniforms["color"], color);
      gl.uniform1f(shader.uniforms["normal_f"], 0.5);

      if (mode === "parallax_hole") {
        let mat = mat4_invert(mvp);
        mat = mat4_mul(mat, translation_mat4([-1.0, -1.0, 0]));
        mat = mat4_mul(mat, scale_mat4([2 / viewport_w, 2 / viewport_h, 1]));
        gl.uniformMatrix4fv(shader.uniforms["m_inv_mvp"], false, mat4_transpose(mat));

        gl.uniform4fv(shader.uniforms["params"], params);

      } else if (mode === "torus" || mode === "feather_disc") {
        gl.uniform4fv(shader.uniforms["params"], params);
      } else if (mode === "background") {
        gl.uniform4fv(shader.uniforms["params"], params);
        gl.uniform4fv(shader.uniforms["params2"], params2);
      }

      gl.drawElements(gl.TRIANGLES, mesh.index_count, gl.UNSIGNED_INT, mesh.index_offset * 4);
    }

    this.draw_bezier = function(mvp, rot, points, radius, params, handlebar, color) {

      let mesh = simple_models["curve"];

      if (force_gray)
        color = gray_bike_color;

      let x = [points[0][0], points[1][0], points[2][0], points[3][0]];
      let y = [points[0][1], points[1][1], points[2][1], points[3][1]];
      let z = [points[0][2], points[1][2], points[2][2], points[3][2]];

      let shader = handlebar ? handlebar_shader : bezier_curve_shader;

      gl.useProgram(shader.shader);

      gl.bindBuffer(gl.ARRAY_BUFFER, basic_vertex_buffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, basic_index_buffer);

      gl.enableVertexAttribArray(shader.attributes["v_st"]);
      gl.vertexAttribPointer(shader.attributes["v_st"], 2, gl.FLOAT, false, 2 * float_size, 0);


      gl.uniformMatrix4fv(shader.uniforms["m_mvp"], false, mat4_transpose(mvp));
      gl.uniformMatrix3fv(shader.uniforms["m_rot"], false, mat3_invert(rot));
      gl.uniform1f(shader.uniforms["radius"], radius);
      if (handlebar)
        gl.uniform2fv(shader.uniforms["st_scale"], params);
      gl.uniform4fv(shader.uniforms["color"], color);
      gl.uniform4fv(shader.uniforms["v_x"], x);
      gl.uniform4fv(shader.uniforms["v_y"], y);
      gl.uniform4fv(shader.uniforms["v_z"], z);


      gl.uniform1f(shader.uniforms["normal_f"], 0.5);

      gl.drawElements(gl.TRIANGLES, mesh.index_count, gl.UNSIGNED_INT, mesh.index_offset * 4);
    }

    this.draw_flex_tube = function(mvp, rot, color, length, bend, r = 1.0, wood) {

      let mesh = simple_models["flex_tube"];

      let shader = wood ? flex_tube_wood_shader : flex_tube_shader

      gl.useProgram(shader.shader);

      setup_base_bindings(shader, mvp, rot);

      gl.uniform4f(shader.uniforms["params"], bend[0], bend[1], length, r);
      gl.uniform4fv(shader.uniforms["color"], color);
      gl.uniform1f(shader.uniforms["normal_f"], 0.5);

      gl.drawElements(gl.TRIANGLES, mesh.index_count, gl.UNSIGNED_INT, mesh.index_offset * 4);
    }

    this.draw_fem_tube = function(mvp, rot, p0, p1, r0, r1, forces, moments, length, radius, A, I, plain = false) {

      let mesh = simple_models["flex_tube"];

      let shader = plain ? plain_fem_shader : fem_shader;

      gl.useProgram(shader.shader);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fem_lut_texture);


      gl.bindBuffer(gl.ARRAY_BUFFER, basic_vertex_buffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, basic_index_buffer);

      gl.enableVertexAttribArray(shader.attributes["v_position"]);
      gl.vertexAttribPointer(shader.attributes["v_position"], 3, gl.FLOAT, false, 24, 0);

      gl.uniformMatrix4fv(shader.uniforms["m_mvp"], false, mat4_transpose(mvp));
      gl.uniformMatrix3fv(shader.uniforms["m_rot"], false, mat3_invert(rot));

      gl.uniform3fv(shader.uniforms["p0"], p0);
      gl.uniform3fv(shader.uniforms["p1"], p1);
      gl.uniform3fv(shader.uniforms["r0"], r0);
      gl.uniform3fv(shader.uniforms["r1"], r1);

      gl.uniform3fv(shader.uniforms["forces"], forces);
      gl.uniform3fv(shader.uniforms["moments"], moments);

      gl.uniform4fv(shader.uniforms["size"], [length, radius, A, I]);

      gl.uniform1i(shader.uniforms["lut"], 0);

      if (plain) {
        gl.uniform4fv(shader.uniforms["color"], frame_color);
        gl.uniform1f(shader.uniforms["normal_f"], 0.5);
      }


      gl.drawElements(gl.TRIANGLES, mesh.index_count, gl.UNSIGNED_INT, mesh.index_offset * 4);
    }

    this.draw_beam = function(mvp, rot, bhlf, color, stress) {


      let line_dim = 0.7;
      let line_color = color.slice();

      line_color[0] *= line_dim;
      line_color[1] *= line_dim;
      line_color[2] *= line_dim;

      let line_offset = -0.00007;

      let shader = stress !== undefined ? beam_stress_shader : beam_shader;

      let line_shader = beam_line_shader;

      gl.useProgram(shader.shader);

      setup_base_bindings(shader, mvp, rot);

      gl.uniform4fv(shader.uniforms["bhlf"], bhlf);
      if (stress === undefined) {


        gl.uniform4fv(shader.uniforms["color"], color);
        gl.uniform1f(shader.uniforms["normal_f"], 0.5);
      } else {
        gl.uniform1f(shader.uniforms["scale"], stress);
      }

      gl.drawElements(gl.TRIANGLES, beam_index_count, gl.UNSIGNED_INT, beam_index_offset * 4);

      let line_arg = [2 / viewport_h, line_offset, viewport_h / viewport_w, 1];


      gl.useProgram(line_shader.shader);

      setup_base_bindings(line_shader, mvp, rot);

      gl.uniform4fv(line_shader.uniforms["bhlf"], bhlf);
      gl.uniform4fv(line_shader.uniforms["line_arg"], line_arg);
      gl.uniform4fv(line_shader.uniforms["color"], line_color);

      gl.drawElements(gl.TRIANGLES, beam_line_index_count, gl.UNSIGNED_INT, beam_line_index_offset * 4);
    }

    this.draw_rod = function(mvp, rot, rRlf, color, stress, twist, skip_cap_lines) {



      if (color[3] < 1.0) {
        gl.enable(gl.BLEND);
        gl.disable(gl.CULL_FACE);
        gl.depthMask(false);
      }

      let line_dim = 0.5;
      let line_color = color.slice();

      line_color[0] *= line_dim;
      line_color[1] *= line_dim;
      line_color[2] *= line_dim;

      if (color[3] < 0.1) {
        line_color = [0, 0, 0, 0.2];
      }

      let line_offset = -0.00007;

      let shader = rod_stress_shader;
      if (twist) {
        shader = stress !== undefined ? rod_twist_stress_shader : rod_twist_shader;
      }


      let line_shader = rod_line_shader;

      gl.useProgram(shader.shader);

      setup_base_bindings(shader, mvp, rot);

      gl.uniform4fv(shader.uniforms["rRlf"], rRlf);
      if (stress === undefined) {


        gl.uniform4fv(shader.uniforms["color"], color);
        gl.uniform1f(shader.uniforms["normal_f"], 0.5);
      } else {
        gl.uniform1f(shader.uniforms["scale"], stress);
      }

      if (twist && stress) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, fem_lut_texture);

        gl.uniform1i(shader.uniforms["lut"], 0);

      }

      gl.drawElements(gl.TRIANGLES, rod_index_count, gl.UNSIGNED_INT, rod_index_offset * 4);

      let line_arg = [2 / viewport_h, line_offset, viewport_h / viewport_w, 1];


      gl.useProgram(line_shader.shader);

      setup_base_bindings(line_shader, mvp, rot);

      if (twist)
        gl.uniform4fv(line_shader.uniforms["rRlf"], [rRlf[0], rRlf[1], rRlf[2], 1000]);
      else
        gl.uniform4fv(line_shader.uniforms["rRlf"], rRlf);

      gl.uniform4fv(line_shader.uniforms["line_arg"], line_arg);
      gl.uniform4fv(line_shader.uniforms["color"], line_color);


      gl.drawElements(gl.TRIANGLES, rod_line_index_count * (skip_cap_lines ? 0.25 : 1), gl.UNSIGNED_INT, rod_line_index_offset * 4);
    }


    this.scissors = function(x, y, w, h) {

      gl.enable(gl.SCISSOR_TEST);

      gl.scissor(x * scale, y * scale, w * scale, h * scale);
    }

    this.draw_thread = function(mvp, rot, color, params) {

      let mesh = simple_models[params ? "inner_thread" : "thread"];

      let shader = params ? dashed_shader : flat_shader;

      gl.useProgram(shader.shader);

      setup_base_bindings(shader, mvp, rot);

      gl.uniform4fv(shader.uniforms["color"], color);
      gl.uniform1f(shader.uniforms["normal_f"], 0.5);
      if (params)
        gl.uniform4fv(shader.uniforms["params"], params);

      gl.drawElements(gl.TRIANGLES, mesh.index_count, gl.UNSIGNED_INT, mesh.index_offset * 4);
    }


    this.draw_arrow = function(mvp, rot, color = force_color, len = 0) {

      this.draw_mesh("Arrow", mvp, rot, {
        color: color,
        shader: "arrow",
        args: [len, 0, 0, 0],
        line_width: 2.5,
        line_dim: 0.5,
      });

    }

    this.draw_mesh = function(name, mvp, rotation, params = {}) {

      let color = [0.8, 0.8, 0.8, 1];

      let color_name = name;

      if (params.base)
        color_name = "Base_" + name;

      if (params.color)
        color = params.color;
      else if (models_colors[color_name])
        color = models_colors[color_name];

      if (force_gray)
        color = gray_bike_color;


      if (color[3] < 1.0) {
        gl.enable(gl.BLEND);
        gl.disable(gl.CULL_FACE);
        gl.depthMask(false);
      }

      if (params.cull_face)
        gl.enable(gl.CULL_FACE);

      if (params.back_face) {
        gl.cullFace(gl.FRONT);
      }


      let line_dim = params.line_dim || 0.7;
      let line_color = color.slice();

      line_color[0] *= line_dim;
      line_color[1] *= line_dim;
      line_color[2] *= line_dim;

      let mesh = models[name];

      let line_offset = -0.00007;

      let shader = params.instances ? instanced_flat_shader : flat_shader;
      let line_shader = params.instances ? simple_instanced_line_shader : simple_line_shader;

      if (params.shader === "wood") {
        shader = wood_shader;
      } else if (params.shader === "deflect") {
        shader = deflect_shader;
        line_shader = deflect_line_shader;
      } else if (params.shader === "arrow") {
        shader = arrow_shader;
        line_shader = arrow_line_shader;
      } else if (params.shader === "dashed") {
        shader = dashed_shader;
        line_shader = dashed_line_shader;
      }

      let line_width = params.line_width || 2;

      let line_arg = [line_width / viewport_h, line_offset, viewport_h / viewport_w, 1];


      gl.useProgram(shader.shader);
      
      
        if (params.instances)
        {
          
              gl.bindBuffer(gl.ARRAY_BUFFER, params.instances == 32 ? cs32_buffer : cs16_buffer);
        
        gl.enableVertexAttribArray(shader.attributes["v_cs"]);
        gl.vertexAttribPointer(shader.attributes["v_cs"], 2, gl.FLOAT, false, 2 * float_size, 0);
        ext.vertexAttribDivisorANGLE(shader.attributes["v_cs"], 1);
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

      gl.enableVertexAttribArray(shader.attributes["v_position"]);
      gl.vertexAttribPointer(shader.attributes["v_position"], 3, gl.FLOAT, false, 24, 0);
      gl.enableVertexAttribArray(shader.attributes["v_normal"]);
      gl.vertexAttribPointer(shader.attributes["v_normal"], 3, gl.FLOAT, false, 24, 12);


      gl.uniformMatrix4fv(shader.uniforms["m_mvp"], false, mat4_transpose(mvp));
      gl.uniformMatrix3fv(shader.uniforms["m_rot"], false, mat3_invert(rotation));

      if (params && params.m_pos)
        gl.uniformMatrix3fv(shader.uniforms["m_pos"], false, params.m_pos);

      gl.uniform4fv(shader.uniforms["color"], color);

      if (params && params.args)
        gl.uniform4fv(shader.uniforms["params"], params.args);

      gl.uniform1f(shader.uniforms["normal_f"], params.normal_f !== undefined ? params.normal_f : 0.5);


if (params.instances) {
       ext.drawElementsInstancedANGLE(gl.TRIANGLES, mesh.index_count, gl.UNSIGNED_INT, mesh.index_offset * 4,
          params.instances);
      
      ext.vertexAttribDivisorANGLE(shader.attributes["v_cs"], 0);
    gl.disableVertexAttribArray(shader.attributes["v_cs"]);

} else {
      gl.drawElements(gl.TRIANGLES, mesh.index_count, gl.UNSIGNED_INT, mesh.index_offset * 4);
    }


      if (mesh.line_index_count > 0 && !params.skip_lines) {

        gl.useProgram(line_shader.shader);
        
        if (params.instances)
          {
            
                gl.bindBuffer(gl.ARRAY_BUFFER, params.instances == 32 ? cs32_buffer : cs16_buffer);
          
          gl.enableVertexAttribArray(line_shader.attributes["v_cs"]);
          gl.vertexAttribPointer(line_shader.attributes["v_cs"], 2, gl.FLOAT, false, 2 * float_size, 0);
          ext.vertexAttribDivisorANGLE(line_shader.attributes["v_cs"], 1);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

        gl.enableVertexAttribArray(line_shader.attributes["v_position"]);
        gl.vertexAttribPointer(line_shader.attributes["v_position"], 3, gl.FLOAT, false, 24, 0);
        gl.enableVertexAttribArray(line_shader.attributes["v_normal"]);
        gl.vertexAttribPointer(line_shader.attributes["v_normal"], 3, gl.FLOAT, false, 24, 12);


        gl.uniformMatrix4fv(line_shader.uniforms["m_mvp"], false, mat4_transpose(mvp));
        gl.uniform4fv(line_shader.uniforms["line_arg"], line_arg);
        gl.uniform4fv(line_shader.uniforms["color"], line_color);

        if (params.args)
          gl.uniform4fv(line_shader.uniforms["params"], params.args);

        if (params.m_pos)
          gl.uniformMatrix3fv(line_shader.uniforms["m_pos"], false, params.m_pos);

if (params.instances) {
                 ext.drawElementsInstancedANGLE(gl.TRIANGLES, mesh.line_index_count, gl.UNSIGNED_INT, mesh.line_index_offset * 4,
                    params.instances);
                
                ext.vertexAttribDivisorANGLE(line_shader.attributes["v_cs"], 0);
              gl.disableVertexAttribArray(line_shader.attributes["v_cs"]);
          
          } else {
    gl.drawElements(gl.TRIANGLES, mesh.line_index_count, gl.UNSIGNED_INT, mesh.line_index_offset * 4);
              }


      }

      if (params.cull_face)
        gl.disable(gl.CULL_FACE);

      if (params.back_face)
        gl.cullFace(gl.BACK);

    }

    this.draw_skinned_mesh = function(name, mvp, rotation, skin_mats) {

      let mesh = models[name];

      let shader = skinned_shader;
      gl.useProgram(shader.shader);

      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

      gl.enableVertexAttribArray(shader.attributes["v_position"]);
      gl.vertexAttribPointer(shader.attributes["v_position"], 3, gl.FLOAT, false, 12 * float_size, 0 * float_size);
      gl.enableVertexAttribArray(shader.attributes["v_normal"]);
      gl.vertexAttribPointer(shader.attributes["v_normal"], 3, gl.FLOAT, false, 12 * float_size, 3 * float_size);
      gl.enableVertexAttribArray(shader.attributes["v_weights"]);
      gl.vertexAttribPointer(shader.attributes["v_weights"], 3, gl.FLOAT, false, 12 * float_size, 6 * float_size);
      gl.enableVertexAttribArray(shader.attributes["v_indices"]);
      gl.vertexAttribPointer(shader.attributes["v_indices"], 3, gl.FLOAT, false, 12 * float_size, 9 * float_size);

      gl.uniformMatrix4fv(shader.uniforms["m_mvp"], false, mat4_transpose(mvp));
      gl.uniformMatrix3fv(shader.uniforms["m_rot"], false, mat3_transpose(rotation));

      gl.uniformMatrix4fv(shader.uniforms["m_skin"], false, skin_mats);


      gl.uniform4fv(shader.uniforms["color"], human_color);

      gl.drawArrays(gl.TRIANGLES, mesh.vertex_offset, mesh.vertex_count);

    }


  }

  function Drawer(container, mode, args) {
    let self = this;

    all_drawers.push(self);
    all_containers.push(container);

    if (args.has_units)
      units_drawers.push(self);

    container.drawer = this;

    let wrapper = document.createElement("div");
    wrapper.classList.add("canvas_container");
    wrapper.classList.add("non_selectable");

    let canvas = document.createElement("canvas");
    canvas.classList.add("non_selectable");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";

    this.canvas = canvas;

    wrapper.appendChild(canvas);
    container.appendChild(wrapper);

    let play = document.createElement("div");
    play.classList.add("play_pause_button");

    play.onclick = function() {
      self.set_paused(!self.paused);
    }

    this.loading_div = document.createElement("div");
    this.loading_div.classList.add("loading_text");
    this.loading_div.textContent = "Loading...";
    container.appendChild(this.loading_div);

    let state;
    let state2; // ugh
    let slider_args = [0, 0, 0];

    let arcball;
    let two_axis;

    let width, height;
    let aspect;

    let inv_k_state;

    let rot;
    if (args.rotation)
      rot = args.rotation;
    else if (mode.startsWith("fem"))
      rot = mat3_mul(rot_x_mat3(3.1), rot_z_mat3(-2.9));
    else
      rot = mat3_mul(rot_x_mat3(1.1), rot_z_mat3(2.2));

    let vp = ident_mat4;
    let proj;
    let ortho_proj;

    this.paused = true;
    this.requested_repaint = false;
    this.requested_tick = false;
    this.first_draw = true;



    if (args.has_arcball) {
      arcball = new ArcBall(rot, function() {
        rot = arcball.matrix.slice();
        request_repaint();
      });
    }

    if (args.has_two_axis) {
      two_axis = new TwoAxis();
      two_axis.set_angles([0, 0]);

      if (mode === "wheel_spoke") {
        two_axis.set_horizontal_limits([0, -0.0]);
      } else if (mode === "slip_angle" || mode === "slip_angle2") {
        two_axis.set_angles([0, mode === "slip_angle2" ? 1.2 : 0.9]);
        two_axis.set_horizontal_limits([0, 0]);
        two_axis.set_vertical_limits([-pi / 2, pi / 2]);
        rot = two_axis.matrix.slice();
      } else {
        two_axis.set_angles([-3.8, -1]);

        if (mode === "bike_force_cornering_intro" || mode === "bike_force_handlebars2")
          two_axis.set_angles([-5.5, -1.3]);
        else if (mode.startsWith("bike_force_cornering"))
          two_axis.set_angles([-5.1, -1.3]);
        else if (mode.startsWith("bike_force_stability3"))
          two_axis.set_angles([-5, -1.3]);

        two_axis.set_vertical_limits([-1.66, 0]);
        if (mode.startsWith("bike_force_stability"))
          two_axis.set_vertical_limits([-1.69, 0]);
        rot = two_axis.matrix.slice();
      }
      two_axis.set_callback(function() {
        rot = two_axis.matrix.slice();
        request_repaint();
      });
    }

    function event_canvas_coordinates(e) {
      let x = e.clientX;
      let y = e.clientY;

      let r = canvas.getBoundingClientRect();
      return [(x - r.left), (y - r.top)];
    }

    let drag_start_point = [0, 0];
    let drag_point = undefined;


    if (arcball || two_axis || args.tracks_drags) {

      let object = arcball || two_axis;
      new TouchHandler(canvas,
        function(e) {
          let c = event_canvas_coordinates(e);

          if (object) {
            object.start(width - c[0], c[1]);
            return true;
          } else if (args.tracks_drags) {
            drag_start_point = drag_point = c;
            request_repaint();
            return true;
          }

          return false;
        },
        function(e) {
          let c = event_canvas_coordinates(e);

          if (object) {
            object.update(width - c[0], c[1], e.timeStamp);
            rot = object.matrix.slice();
            request_repaint();
          } else if (args.tracks_drags) {
            drag_point = c;
            request_repaint();
          }
          return true;
        },
        function(e) {
          if (object) {
            object.end(e.timeStamp);
          } else if (args.tracks_drags) {
            drag_point = undefined;
            request_repaint();
          }

        });
    }

    if (mode === "wheel_grabber") {
      canvas.addEventListener("mousemove", e => {

        let c = event_canvas_coordinates(e);
        let l = vec_len(vec_sub(c, [width / 2, height / 2]));

        let style = (l > width * 0.275 && l < width * 0.355) ? "grab" : "default";

        if (state && state.dragging)
          style = "grabbing";
        canvas.style.cursor = style;

        return true;
      }, false);
    }

    this.set_paused = function(p) {

      if (self.paused == p)
        return;

      self.paused = p;

      if (self.paused) {
        play.classList.remove("playing");
      } else {
        play.classList.add("playing");
        if (!self.requested_tick) {
          self.requested_tick = true;
          window.requestAnimationFrame(tick);
        }
      }
    }

    this.reset = function() {
      state = undefined;

      if (reset_callback)
        reset_callback();
    }

    let sim_slider;
    this.set_sim_slider = function(x) {
      sim_slider = x;
    }

    let t = 0;
    let prev_timestamp = undefined;

    function tick(timestamp) {

      self.requested_tick = false;

      let rect = canvas.getBoundingClientRect();

      let wh = window.innerHeight || document.documentElement.clientHeight;
      let ww = window.innerWidth || document.documentElement.clientWidth;

      if (prev_timestamp === undefined)
        prev_timestamp = timestamp;

      if (!(rect.top > wh || rect.bottom < 0 || rect.left > ww || rect.right < 0)) {

        let dt = Math.min((timestamp - prev_timestamp) / 1000, 1.0 / 40.0);
        t += dt;

        self.repaint(dt);
      }

      if (self.paused) {
        prev_timestamp = undefined;
      } else {
        prev_timestamp = timestamp;
        window.requestAnimationFrame(tick);
      }

    }

    if (args.animated) {
      wrapper.appendChild(play);
      animated_drawers.push(this);
    }



    if (args.has_reset) {

      let reset = document.createElement("div");
      reset.classList.add("restart_button");

      reset.onclick = function() {
        self.reset();
        self.set_paused(false);
      }

      wrapper.appendChild(reset);
    }

    if (args.simulated) {
      this.set_paused(false);
    }


    function request_repaint(force = false) {
      if (self.requested_repaint || (!self.paused && !self.first_draw && !force))
        return;

      self.requested_repaint = true;
      window.requestAnimationFrame(function() {
        self.repaint();
      });
    }

    this.request_repaint = request_repaint;

    this.set_visible = function(x) {
      this.visible = x;
      if (x)
        request_repaint();
    }

    this.set_slider_arg = function(i, x) {
      slider_args[i] = x;
      if (args.simulated)
        this.set_paused(false);

      request_repaint();
    }

    this.slider_arg = function(i) {
      return slider_args[i];
    }

    this.set_rot = function(x) {
      rot = x;
      if (arcball)
        arcball.set_matrix(x);

      request_repaint();
    }

    this.set_angles = function(x) {
      if (two_axis)
        two_axis.set_angles(x);

      rot = two_axis.matrix.slice();

      request_repaint();
    }

    let reset_callback;
    this.set_reset_callback = function(x) {
      reset_callback = x;
    }


    this.reset();

    this.on_resize = function() {
      let new_width = wrapper.clientWidth;
      let new_height = wrapper.clientHeight;

      if (new_width == width && new_height == height)
        return;

      width = new_width;
      height = new_height;

      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.width = width * scale;
      canvas.height = height * scale;

      aspect = args.aspect ? args.aspect : width / height;

      let proj_w = 1000;
      let proj_h = proj_w / aspect;

      ortho_proj = [
        1 / proj_w, 0, 0, 0,
        0, 1 / proj_h, 0, 0,
        0, 0, -0.0005, 0,
        0, 0, 0, 1
      ];

      let fov = pi * 0.14;
      let near = 1.0;
      let far = 17.0;

      let f = 1 / Math.tan(fov / 2);
      let rangeInv = 1 / (near - far);

      proj = [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
      ];


      proj = mat4_transpose(proj);
      proj = mat4_mul(proj, translation_mat4([0, 0, -6.5]));
      proj = mat4_mul(proj, scale_mat4(0.001));

      let pad = 5;
      let a_size = Math.max(width, height) - pad * 2;

      if (arcball)
        arcball.set_viewport(width / 2 - a_size / 2 + pad,
          height / 2 - a_size / 2 + pad,
          a_size, a_size);
      else if (two_axis)
        two_axis.set_size([width, height]);

      request_repaint();
    }


    this.repaint = function(dt = 0) {


      self.requested_repaint = false;


      if (!self.visible)
        return;

      if (width == 0 || height == 0)
        return;

      vp = mat4_mul(proj, mat3_to_mat4(rot));

      const ctx = canvas.getContext("2d");

      ctx.resetTransform();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.setLineDash([]);

      let base_line_width = 1.5;

      let font_size = 22;

      if (window.innerWidth < 350)
        font_size = 16;
      else if (window.innerWidth < 400)
        font_size = 18;
      else if (window.innerWidth < 500)
        font_size = 20;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = base_line_width;

      ctx.font = font_size + "px IBM Plex Sans";
      ctx.textAlign = "center";
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = "source-over";

      if (!models_ready) {
        return;
      } else if (self.loading_div) {
        self.loading_div.remove();
        self.loading_div = undefined;
      }

      self.first_draw = false;


      if (mode.startsWith("fem")) {


        let base_ro = undefined;
        let base_ri = undefined;

        let node_params = [


          { name: "rear0", position: vec_add(rear, [0, 0, +rear_dropout_width / 2]) },
          { name: "rear1", position: vec_add(rear, [0, 0, -rear_dropout_width / 2]) },
          { name: "front0", position: vec_add(front, [0, 0, +front_dropout_width / 2]) },
          { name: "front1", position: vec_add(front, [0, 0, -front_dropout_width / 2]) },
          { name: "sprocket", position: sprocket },
          { name: "sprocket0", position: vec_add(sprocket, [0, 0, +20]) },
          { name: "sprocket1", position: vec_add(sprocket, [0, 0, -20]) },
          { name: "seat", position: seat },
          { name: "front", position: front },
          { name: "front_up", position: front_up },
          { name: "front_down", position: front_down },
          { name: "front_down0", position: vec_add(front_down, [0, 0, +30]) },
          { name: "front_down1", position: vec_add(front_down, [0, 0, -30]) },

        ];

        function node_index(name) { return node_params.findIndex(el => el.name === name) };

        function node_position(name) { return node_params[node_index(name)].position; };

        let link_params = [
          { i0: node_index("rear0"), i1: node_index("sprocket0"), ro: 0.011, thickness: 0.0008 },
          { i0: node_index("rear1"), i1: node_index("sprocket1"), ro: 0.011, thickness: 0.0008 },
          { i0: node_index("sprocket"), i1: node_index("sprocket0"), ro: 0.015, thickness: 0.0008 },
          { i0: node_index("sprocket"), i1: node_index("sprocket1"), ro: 0.015, thickness: 0.0008 },
          { i0: node_index("rear0"), i1: node_index("seat"), ro: 0.007, thickness: 0.001 },
          { i0: node_index("rear1"), i1: node_index("seat"), ro: 0.007, thickness: 0.001 },
          { i0: node_index("seat"), i1: node_index("sprocket"), ro: 0.0143, thickness: 0.0009 },
          { i0: node_index("sprocket"), i1: node_index("front_down"), ro: 0.0133, thickness: 0.0009 },
          { i0: node_index("front_down"), i1: node_index("front_up"), ro: 0.016, thickness: 0.0009 },
          { i0: node_index("front_up"), i1: node_index("seat"), ro: 0.0127, thickness: 0.0009 },
          { i0: node_index("front_down0"), i1: node_index("front0"), ro: 0.012, thickness: 0.0012 },
          { i0: node_index("front_down1"), i1: node_index("front1"), ro: 0.012, thickness: 0.0012 },
          { i0: node_index("front_down0"), i1: node_index("front_down"), ro: 0.012, thickness: 0.0012 },
          { i0: node_index("front_down1"), i1: node_index("front_down"), ro: 0.012, thickness: 0.0012 },
          { i0: node_index("front0"), i1: node_index("front"), ro: 0.005, ri: 0, skip: true },
          { i0: node_index("front1"), i1: node_index("front"), ro: 0.005, ri: 0, skip: true },
        ];

        let base_link_params = link_params;

        let trim_dof = [
          node_index("rear0") * 6 + 0,
          node_index("rear0") * 6 + 1,
          node_index("rear0") * 6 + 2,

          node_index("rear1") * 6 + 0,
          node_index("rear1") * 6 + 1,
          node_index("rear1") * 6 + 2,

          node_index("front") * 6 + 1,

        ];


        let seat_weight = 0;
        let pedal_weight = 0;


        if (mode === "fem1" || mode === "fem2" || mode === "fem3" || mode === "fem4" ||
          mode === "fem5" || mode === "fem6" || mode === "fem7" || mode === "fem9") {

          let r_arg = slider_args[mode === "fem1" ? 0 : 1];

          let front_mid = vec_lerp(front_up, front_down, 0.5);

          let s = vec_sub(rear, front_mid);
          let r = vec_sub(seat, sprocket);

          let t = vec_cross(vec_sub(seat, rear), s)[2] / vec_cross(r, s)[2];
          if (mode === "fem7") {
            t = lerp(0.9, 0.05, slider_args[2]);
          } else if (mode === "fem9") {
            t = 0.02;
          }
          let mid = vec_lerp(seat, sprocket, t);

          let ro = lerp(0.005, 0.015, r_arg);
          let ri = 0;

          if (mode === "fem4" || mode === "fem5") {
            ro = 0.01;
            let A = ro * ro * pi;
            let thickness = lerp(0.01, 0.004, r_arg);
            if (mode === "fem5")
              thickness = 0.004;

            ro = (A / pi + thickness * thickness) / (2 * thickness);
            ri = ro - thickness;
          } else if (mode === "fem6" || mode === "fem7") {
            ro = lerp(0.005, 0.02, r_arg);
            let thickness = 0.001;
            ri = ro - thickness;
          } else if (mode === "fem9") {
            ro = 0.015;
            let thickness = 0.001;
            ri = ro - thickness;
          }

          base_ro = ro;
          base_ri = ri;

          if (mode !== "fem1")
            seat_weight = slider_args[0] * -1e3;

          if (mode === "fem5" || mode === "fem6" || mode === "fem7" || mode === "fem9") {
            seat_weight = (1 - slider_args[0]) * -1e3;
            pedal_weight = slider_args[0] * -1e3;
          }





          node_params = [
            { name: "seat", position: seat },
            { name: "seat_up", position: vec_add(seat, vec_scale(seat_axis, 70)) },
            { name: "mid", position: mid },
            { name: "rear0", position: vec_add(rear, [0, 0, +60]) },
            { name: "rear1", position: vec_add(rear, [0, 0, -60]) },
            { name: "sprocket", position: sprocket },
            { name: "sprocket0", position: vec_add(sprocket, [0, 0, +20]) },
            { name: "sprocket1", position: vec_add(sprocket, [0, 0, -20]) },

            { name: "mid0", position: vec_add(mid, [0, 0, +20]) },
            { name: "mid1", position: vec_add(mid, [0, 0, -20]) },
            { name: "front_up", position: front_up },
            { name: "front_down", position: front_down },
            { name: "front_mid", position: front_mid },

            { name: "front", position: front },


            { name: "front0", position: vec_add(front, [0, 0, +front_dropout_width / 2]) },
            { name: "front1", position: vec_add(front, [0, 0, -front_dropout_width / 2]) },

            { name: "front_bottom", position: vec_sub(front_down, vec_scale(steer_axis, 40)) },
            { name: "front_down0", position: vec_add(vec_sub(front_down, vec_scale(steer_axis, 40)), [0, 0, +30]) },
            { name: "front_down1", position: vec_add(vec_sub(front_down, vec_scale(steer_axis, 40)), [0, 0, -30]) },
          ]

          node_params[node_index("seat")].forces = [0, seat_weight, 0, 0, 0, 0];
          node_params[node_index("sprocket")].forces = [0, pedal_weight, 0,
            -pedal_weight * 0.12, 0, 0
          ];

          link_params = [
            { i0: node_index("seat"), i1: node_index("mid"), ro: ro, ri: ri },
            { i0: node_index("seat"), i1: node_index("seat_up"), ro: ro, ri: ri },
            { i0: node_index("rear0"), i1: node_index("mid0"), ro: ro, ri: ri, cap: true },
            { i0: node_index("rear1"), i1: node_index("mid1"), ro: ro, ri: ri, cap: true },
            { i0: node_index("mid0"), i1: node_index("mid"), ro: ro, ri: ri },
            { i0: node_index("mid1"), i1: node_index("mid"), ro: ro, ri: ri },
            { i0: node_index("sprocket"), i1: node_index("mid"), ro: ro, ri: ri },
            { i0: node_index("front_mid"), i1: node_index("mid"), ro: ro, ri: ri },

            { i0: node_index("front_down0"), i1: node_index("front_bottom"), ro: 0.02 / 2, thickness: 0.0009, skip: true },
            { i0: node_index("front_down1"), i1: node_index("front_bottom"), ro: 0.02 / 2, thickness: 0.0009, skip: true },
            { i0: node_index("front_down0"), i1: node_index("front0"), ro: 0.02 / 2, thickness: 0.0009, skip: true },
            { i0: node_index("front_down1"), i1: node_index("front1"), ro: 0.02 / 2, thickness: 0.0009, skip: true },
            { i0: node_index("front0"), i1: node_index("front"), ro: ro, ri: 0, skip: true },
            { i0: node_index("front1"), i1: node_index("front"), ro: ro, ri: 0, skip: true },
            { i0: node_index("sprocket"), i1: node_index("sprocket0"), ro: 0.02, thickness: 0.0008 },
            { i0: node_index("sprocket"), i1: node_index("sprocket1"), ro: 0.02, thickness: 0.0008 },

            { i0: node_index("front_mid"), i1: node_index("front_up"), ro: 0.033 / 2, thickness: 0.0009 },
            { i0: node_index("front_mid"), i1: node_index("front_down"), ro: 0.033 / 2, thickness: 0.0009 },

            { i0: node_index("front_down"), i1: node_index("front_bottom"), ro: 0.033 / 2, thickness: 0.0009 },
          ];




          if (mode === "fem6" || mode === "fem7" || mode === "fem9") {
            link_params.push({ i0: node_index("sprocket0"), i1: node_index("rear0"), ro: ro, ri: ri, cap: true }, { i0: node_index("sprocket1"), i1: node_index("rear1"), ro: ro, ri: ri, cap: true }, { i0: node_index("sprocket"), i1: node_index("front_down"), ro: ro, ri: ri },

            )
          }

          if (mode === "fem9") {
            let t = slider_args[1];
            // seat
            link_params[0].ro = lerp(link_params[0].ro, 0.016, t);
            link_params[0].ri = lerp(link_params[0].ri, 0.016 - 0.0017, t);
            link_params[1].ro = lerp(link_params[1].ro, 0.016, t);
            link_params[1].ri = lerp(link_params[1].ri, 0.016 - 0.0017, t);
            link_params[6].ro = lerp(link_params[6].ro, 0.016, t);
            link_params[6].ri = lerp(link_params[6].ri, 0.016 - 0.0017, t);


            link_params[2].ro = lerp(link_params[2].ro, 0.008, t);
            link_params[2].ri = lerp(link_params[2].ri, 0.008 - 0.001, t);
            link_params[3].ro = lerp(link_params[3].ro, 0.008, t);
            link_params[3].ri = lerp(link_params[3].ri, 0.008 - 0.001, t);

            link_params[4].ro = lerp(link_params[4].ro, 0.016, t);
            link_params[4].ri = lerp(link_params[4].ri, 0.016 - 0.001, t);
            link_params[5].ro = lerp(link_params[5].ro, 0.016, t);
            link_params[5].ri = lerp(link_params[5].ri, 0.016 - 0.001, t);



            link_params[20].ro = lerp(link_params[20].ro, 0.012, t);
            link_params[20].ri = lerp(link_params[20].ri, 0.012 - 0.001, t);

            link_params[19].ro = lerp(link_params[19].ro, 0.012, t);
            link_params[19].ri = lerp(link_params[19].ri, 0.012 - 0.001, t);

            link_params[21].ro = lerp(link_params[21].ro, 0.016, t);
            link_params[21].ri = lerp(link_params[21].ri, 0.016 - 0.001, t);

          }


          trim_dof = [
            node_index("rear0") * 6 + 0,
            node_index("rear0") * 6 + 1,
            node_index("rear0") * 6 + 2,

            node_index("rear1") * 6 + 0,
            node_index("rear1") * 6 + 1,
            node_index("rear1") * 6 + 2,

            node_index("front") * 6 + 1,

          ];
        } else if (mode === "fem8") {


          node_params = [

            { name: "a", position: [0, 0, 0] },
            { name: "b", position: [0.6 * 140, 0, 0] },
            { name: "c", position: [140, 0, 0] },
          ];

          node_params[node_index("b")].forces = [0, -3e2 * slider_args[0], 0, 0, 0, 0];

          link_params = [
            { i0: node_index("a"), i1: node_index("b"), ro: 0.004, ri: 0 },
            { i0: node_index("b"), i1: node_index("c"), ro: 0.004, ri: 0 },
          ];

          trim_dof = [
            node_index("a") * 6 + 0,
            node_index("a") * 6 + 1,
            node_index("a") * 6 + 2,
            node_index("a") * 6 + 3,
            node_index("a") * 6 + 4,

            node_index("c") * 6 + 0,
            node_index("c") * 6 + 1,
            node_index("c") * 6 + 2,
          ];
        }

        let n_nodes = node_params.length;
        let n_links = link_params.length;
        let trim_n = trim_dof.length;

        let n_dof = n_nodes * 6;

        let forces = new Float64Array(n_dof);



        /* Steel */

        let E = 200e9;
        let G = 80e9;
        let density = 7850;

        // if (state === undefined)
        {
          state = {};

          state.state = new Float64Array(n_dof);
          state.displacements = new Float64Array(n_dof);
          state.forces = forces;

          state.matrix = new Float64Array(n_dof * n_dof);
          state.links = new Array(n_links);

          for (let i = 0; i < n_nodes; i++) {
            let params = node_params[i];
            state.state[i * 6 + 0] = params.position[0] / 1000;
            state.state[i * 6 + 1] = params.position[1] / 1000;
            state.state[i * 6 + 2] = params.position[2] / 1000;

            if (params.forces) {
              for (let j = 0; j < 6; j++)
                forces[i * 6 + j] = params.forces[j];
            }
          }

          for (let i = 0; i < n_links; i++) {

            let params = link_params[i];
            let link = {};

            let ro = params.ro;
            let ri = params.ri !== undefined ? params.ri : (ro - params.thickness);

            link.ro = ro;
            link.Iy = pi * (ro * ro * ro * ro - ri * ri * ri * ri) * 0.25;
            link.Iz = link.Iy;
            link.J = link.Iy + link.Iy;

            link.A = pi * (ro * ro - ri * ri);

            link.node0 = params.i0;
            link.node1 = params.i1;

            link.skip = params.skip;
            link.cap = params.cap;

            state.links[i] = link;
          }


          let s = state.state;
          let f = state.forces;
          let m = state.matrix;
          let v = state.state;

          let l = state.links;

          let tube_total_volume = 0;

          for (let i = 0; i < n_links; i++) {

            let link = l[i];

            let li0 = link.node0;
            let li1 = link.node1;

            let p0 = [v[li0 * 6 + 0], v[li0 * 6 + 1], v[li0 * 6 + 2]];
            let p1 = [v[li1 * 6 + 0], v[li1 * 6 + 1], v[li1 * 6 + 2]];

            let dir_x = vec_sub(p1, p0);
            let L = vec_len(dir_x);

            link.length = L;

            if (!link.skip)
              tube_total_volume += L * link.A;

            dir_x = vec_scale(dir_x, 1 / L);

            let dir_z = [0, 0, 1];
            if (abs(dir_x[2]) == 1) {
              dir_z = [-1, 0, 0];
            }
            dir_z = vec_sub(dir_z, vec_scale(dir_x, vec_dot(dir_z, dir_x)));

            let dir_y = vec_cross(dir_z, dir_x);

            let rot = [dir_x[0], dir_x[1], dir_x[2],
              dir_y[0], dir_y[1], dir_y[2],
              dir_z[0], dir_z[1], dir_z[2]
            ];

            link.matrix = rot;
            link.stiffness = new Float64Array(12 * 12);

            let rot_mat = new Float64Array(6 * 6); {
              for (let p = 0; p < 2; p++) {
                for (let i = 0; i < 3; i++) {
                  for (let j = 0; j < 3; j++) {
                    rot_mat[p * 6 * 3 + p * 3 + i * 6 + j] = rot[i * 3 + j];
                  }
                }
              }
            }

            function apply_rotation_matrix(lm, rot_mat) {

              /* Return R^T * lm * R   */

              let tmp = new Float64Array(6 * 6);
              let res = new Float64Array(6 * 6);

              for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 6; j++) {
                  for (let p = 0; p < 6; p++) {
                    tmp[i * 6 + j] += lm[i * 6 + p] * rot_mat[j + p * 6]
                  }
                }
              }

              for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 6; j++) {
                  for (let p = 0; p < 6; p++) {
                    res[i * 6 + j] += rot_mat[p * 6 + i] * tmp[j + p * 6]
                  }
                }
              }

              return res;
            }



            function copy_6x6(dest, dest_n, row, col, src) {

              for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 6; j++) {
                  dest[(row + i) * dest_n + col + j] += src[i * 6 + j];
                }
              }
            }

            let Iy = link.Iy;
            let Iz = link.Iz;
            let J = link.J;
            let A = link.A;

            let lm = new Float64Array(6 * 6);
            let transformed_lm;

            /* https://www.youtube.com/watch?v=opaKpuyWcsg */

            lm[0 * 6 + 0] = A * E / L;

            lm[1 * 6 + 1] = 12 * E * Iz / (L * L * L);
            lm[1 * 6 + 5] = 6 * E * Iz / (L * L);

            lm[2 * 6 + 2] = 12 * E * Iy / (L * L * L);
            lm[2 * 6 + 4] = -6 * E * Iy / (L * L);

            lm[3 * 6 + 3] = G * J / L;

            lm[4 * 6 + 2] = -6 * E * Iy / (L * L);
            lm[4 * 6 + 4] = 4 * E * Iy / L;

            lm[5 * 6 + 1] = 6 * E * Iz / (L * L);
            lm[5 * 6 + 5] = 4 * E * Iz / L;

            transformed_lm = apply_rotation_matrix(lm, rot_mat);

            // Fill in the stiffness matrix

            copy_6x6(m, n_dof, li0 * 6, li0 * 6, transformed_lm);
            copy_6x6(link.stiffness, 12, 0, 0, transformed_lm);

            lm[1 * 6 + 5] *= -1;
            lm[2 * 6 + 4] *= -1;
            lm[4 * 6 + 2] *= -1;
            lm[5 * 6 + 1] *= -1;

            transformed_lm = apply_rotation_matrix(lm, rot_mat);

            copy_6x6(m, n_dof, li1 * 6, li1 * 6, transformed_lm);
            copy_6x6(link.stiffness, 12, 6, 6, transformed_lm);


            lm[0 * 6 + 0] *= -1;
            lm[1 * 6 + 1] *= -1;
            lm[2 * 6 + 2] *= -1;
            lm[3 * 6 + 3] *= -1;
            lm[4 * 6 + 2] *= -1;
            lm[4 * 6 + 4] *= 0.5;
            lm[5 * 6 + 1] *= -1;
            lm[5 * 6 + 5] *= 0.5;

            transformed_lm = apply_rotation_matrix(lm, rot_mat);

            copy_6x6(m, n_dof, li1 * 6, li0 * 6, transformed_lm);
            copy_6x6(link.stiffness, 12, 6, 0, transformed_lm);

            lm[1 * 6 + 5] *= -1;
            lm[2 * 6 + 4] *= -1;
            lm[4 * 6 + 2] *= -1;
            lm[5 * 6 + 1] *= -1;

            transformed_lm = apply_rotation_matrix(lm, rot_mat);

            copy_6x6(m, n_dof, li0 * 6, li1 * 6, transformed_lm);
            copy_6x6(link.stiffness, 12, 0, 6, transformed_lm);
          }


          state.tube_total_volume = tube_total_volume;

          let rn_dof = n_dof - trim_n;

          let rs = new Float64Array(rn_dof);
          let rf = new Float64Array(rn_dof);
          let rm = new Float64Array(rn_dof * rn_dof);

          let y = 0;
          for (let i = 0; i < n_dof; i++) {

            if (trim_dof.some(k => k == i))
              continue;

            rf[y] = state.forces[i];

            let x = 0;

            for (let j = 0; j < n_dof; j++) {

              if (trim_dof.some(k => k == j))
                continue;

              rm[y * rn_dof + x] = m[i * n_dof + j]

              x++;
            }

            y++;
          }


          let sol = gauss_jordan(rm, rf, rn_dof);

          // refill back

          {
            let y = 0;
            for (let i = 0; i < n_dof; i++) {

              if (!trim_dof.some(k => k == i)) {
                state.displacements[i] += sol[y];
                y++;
              }
            }
          }


          // end
        }

        let v = state.state;
        let d = state.displacements;
        let l = state.links;

        for (let i = 0; i < n_links; i++) {
          let link = state.links[i];

          let li0 = link.node0;
          let li1 = link.node1;

          let element_displacement_g = new Float64Array(12);

          for (let i = 0; i < 6; i++) {
            element_displacement_g[i] = state.displacements[li0 * 6 + i];
            element_displacement_g[6 + i] = state.displacements[li1 * 6 + i];
          }

          let element_force_g = new Float64Array(12);
          let element_force_l = new Float64Array(12);

          let m = link.stiffness;
          let rot = link.matrix;

          for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 12; j++) {
              element_force_g[i] += m[i * 12 + j] * element_displacement_g[j];
            }
          }


          for (let i = 0; i < 4; i++) {
            let f = [element_force_g[i * 3 + 0],
              element_force_g[i * 3 + 1],
              element_force_g[i * 3 + 2]
            ];
            let v = mat3_mul_vec(rot, f);

            element_force_l[i * 3 + 0] = v[0];
            element_force_l[i * 3 + 1] = v[1];
            element_force_l[i * 3 + 2] = v[2];
          }

          link.forces = element_force_l.slice(0, 6);


          let sig_n = -element_force_l[0] / link.A;

        }


        let zoom_scale = 2.1;

        if (mode === "fem1" || mode === "fem2") {
          zoom_scale = 2.1;
        } else if (mode === "fem8") {
          zoom_scale = 26;
        }



        let front_dis = state.displacements.slice(node_index("front") * 6 + 0, node_index("front") * 6 + 3);

        let front_rot = state.displacements.slice(node_index("front") * 6 + 3, node_index("front") * 6 + 6);

        let front_pots = vec_add(front, vec_scale(front_dis, 1000));
        let mvp = translation_mat4(vec_scale(front_pots, -0.5));
        mvp = mat4_mul(translation_mat4([0, -150, 0]), mvp);
        mvp = mat4_mul(scale_mat4(zoom_scale), mvp);

        if (mode === "fem8") {

          mvp = translation_mat4([-70, 0, 0]);
          mvp = mat4_mul(scale_mat4(zoom_scale), mvp);
        }

        mvp = mat4_mul(vp, mvp);

        let bike_mat = mat4_mul(mvp, scale_mat4(1000));

        gl.begin(width, height);

        for (let i = 0; i < n_links; i++) {
          let link = state.links[i];

          if (link.skip)
            continue;

          let li0 = link.node0;
          let li1 = link.node1;

          let mat = link.matrix;
          let imat = mat3_transpose(mat);

          let o0 = [v[li0 * 6 + 0], v[li0 * 6 + 1], v[li0 * 6 + 2]];
          let o1 = [v[li1 * 6 + 0], v[li1 * 6 + 1], v[li1 * 6 + 2]];

          let p0 = mat3_mul_vec(mat, [d[li0 * 6 + 0], d[li0 * 6 + 1], d[li0 * 6 + 2]]);
          let p1 = mat3_mul_vec(mat, [d[li1 * 6 + 0], d[li1 * 6 + 1], d[li1 * 6 + 2]]);
          let r0 = mat3_mul_vec(mat, [d[li0 * 6 + 3], d[li0 * 6 + 4], d[li0 * 6 + 5]]);
          let r1 = mat3_mul_vec(mat, [d[li1 * 6 + 3], d[li1 * 6 + 4], d[li1 * 6 + 5]]);


          let torsion = rot_x_mat3(r1[0] - r0[0]);

          let len = link.length;

          let forces = link.forces.slice(0, 3);

          let moments = link.forces.slice(3, 6);
          moments[0] *= link.ro / link.J;


          let m = mat3_to_mat4(imat);
          m = mat4_mul(translation_mat4(o0), m);
          m = mat4_mul(bike_mat, m);

          let r = mat3_mul(rot, imat);

          gl.draw_fem_tube(m, r, p0, p1, r0, r1, forces, moments, len,
            link.ro, 1.0 / link.A, 1.0 / link.Iz, mode === "fem1" || mode === "fem2");
        }

        if (mode !== "fem8") {

          let i = node_index("sprocket");
          let sprocket_offset = state.displacements.slice(i * 6 + 0, i * 6 + 3);

          i = node_index("front_mid");
          let front_offset = state.displacements.slice(i * 6 + 0, i * 6 + 3);
          let front_a = state.displacements[i * 6 + 5];
          let front_tilt = state.displacements[i * 6 + 3];

          i = node_index("seat_up");
          let seat_offset = state.displacements.slice(i * 6 + 0, i * 6 + 3);
          let seat_a = state.displacements[i * 6 + 5];

          force_gray = true;
          draw_bike(mvp, rot, {
            front_wheel_angle: front_dis[0] * 1000 * 0.5 / tire_outer_R + front_a,
            rear_wheel_angle: -front_dis[0] * 1000 * 0.5 / tire_outer_R,
            fem: {
              sprocket: vec_scale(sprocket_offset, 1000),
              front: vec_scale(front_offset, 1000),
              front_a: front_a,
              front_tilt: front_tilt,
              seat: vec_scale(seat_offset, 1000),
              seat_a: seat_a,
            },
          });

          force_gray = false;
        }


        let ff = [];

        if (mode === "fem8") {
          ff.push({
            name: "b",
            offset: [0, 4, 0],
            size: slider_args[0] * 0.5
          })

          ff.push({
            name: "a",
            offset: [0, -4, 0],
            size: slider_args[0] * 0.4 * 0.5,
            rot: pi
          })

          ff.push({
            name: "c",
            offset: [0, -4, 0],
            size: slider_args[0] * 0.6 * 0.5,
            rot: pi
          })
        } else {
          ff.push({
            name: "seat",
            offset: [0, 130, 0],
            size: -seat_weight * 0.004,
          })

          ff.push({
            name: "sprocket",
            offset: [0, 160, 120],
            size: -pedal_weight * 0.004,
          })
        }

        for (let p of ff) {
          let i = node_index(p.name);
          let params = node_params[i];

          let dis = state.displacements.slice(i * 6 + 0, i * 6 + 3);

          let pos = vec_add(params.position, vec_scale(dis, 1000));
          pos = vec_add(pos, p.offset);

          let mat = mat4_mul(rot_x_mat4(-pi / 2), rot_z_mat4(pi / 2));
          mat = mat4_mul(rot_x_mat4(p.rot || 0), mat);
          mat = mat4_mul(scale_mat4(p.size), mat);
          mat = mat4_mul(translation_mat4(pos), mat);

          let r = mat3_mul(rot_x_mat3(-pi / 2), rot_z_mat3(pi / 2));

          gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), mode === "fem8" ? force2_color : force_color, 10);
        }


        ctx.drawImage(gl.finish(), 0, 0, width, height);

        ctx.feather(width * scale, height * scale,
          canvas.height * 0.1, canvas.height * 0.1,
          canvas.height * 0.1, canvas.height * 0.1);


        if (mode !== "fem8") {

          ctx.save();
          ctx.translate(width / 2, height - font_size);

          let str = weight_string(state.tube_total_volume * density);
          let w = ctx.measureText(str).width;


          ctx.fillStyle = "rgba(230, 230, 230, 0.8)";

          let s = font_size;
          ctx.roundRect(-w * 0.5 - s * 0.4, -s * 1.1, w + s * 0.8, 1.6 * s, s * 0.3);
          ctx.fill();

          ctx.fillStyle = "#333"
          ctx.fillText(str, 0, 0);

          ctx.restore();
        }

        ctx.fillStyle = "#293B6F";

        if (base_ro)
          ctx.fillEllipse(width - font_size, height - font_size, base_ro * height * 2);
        if (base_ri) {
          ctx.globalCompositeOperation = "destination-out";
          ctx.fillEllipse(width - font_size, height - font_size, base_ri * height * 2);
          ctx.globalCompositeOperation = "source-over";
        }


      } else if (mode.startsWith("force")) {


        let cog = false;

        if (state === undefined) {
          state = {};
          state.velocity = [0, 0];
          state.position = [0, 0];

          state.alpha = 0;
          state.dalpha = 0;



          if (mode === "force1" || mode === "force8" || mode === "force9")
            state.position = [-1.5, 0];
          else if (mode === "force12")
            state.position = [0, -1];
          else if (mode === "force3") {
            state.slider = 0.5;
            state.slider_t = 0.0;
          }

        }
        let forces = [];

        if (mode === "force1") {
          forces = [{
            origin: [0, -0.0],
            direction: [slider_args[0], 0],
          }];
        } else if (mode === "force2") {
          forces = [{
            origin: [0, -0.0],
            direction: [slider_args[0], 0],
          }];
        } else if (mode === "force3") {
          forces = [{
              origin: [-10, -0.0],
              direction: [2 * slider_args[0], 0],
            },
            {
              origin: [10, -0.0],
              direction: [-1, 0],
              color: force1_color_css
            }
          ];
        } else if (mode === "force8") {
          forces = [{
            origin: [-10, -0.15],
            direction: [slider_args[0], 0],
            line: true,
          }];
          cog = true;
        } else if (mode === "force9") {
          forces = [{
            origin: [-10, -0.4],
            direction: [slider_args[0], 0],
            line: true,
          }];
          cog = true;
        } else if (mode === "force10") {
          forces = [{
            origin: [-10, lerp(-0.4, 0.4, slider_args[0])],
            direction: [0.4, 0],
            line: true,
          }, {
            origin: [10, lerp(0.4, -0.4, slider_args[0])],
            direction: [-0.4, 0],
            line: true,
            color: force1_color_css
          }];
          cog = true;
        } else if (mode === "force11") {
          forces = [{
            origin: [-10, 0.5],
            direction: [slider_args[0] * 0.5, 0],
            line: true,
          }, {
            origin: [-10, -0.25],
            direction: [slider_args[0], 0],
            line: true,
            color: force1_color_css
          }, {
            origin: [10, 0],
            direction: [-slider_args[0] * 1.5, 0],
            line: true,
            color: force2_color_css
          }];
          cog = true;
        } else if (mode === "force13") {
          forces = [{
            origin: [0, 0],
            direction: [1.2 * slider_args[0], 0.6 * slider_args[0]],
            line: true,
            color: force_color_css,
          }, {
            origin: [0, 0.5],
            direction: [0, -0.6 * slider_args[0]],
            line: true,
            color: force6_color_css
          }, {
            origin: [0.5, 0],
            direction: [-1.2 * slider_args[0], 0],
            line: true,
            color: force1_color_css
          }];
        }

        let m = 1;
        let I = m / 6;
        let wall_k = 6;

        if (mode !== "force4" && mode !== "force5" && mode !== "force5a" && mode !== "force5b" && mode !== "force6" && mode !== "force7" && mode !== "force12" && mode !== "force13") {
          let force = [0, 0];
          let torque = 0;
          forces.forEach(f => {
            force = vec_add(force, f.direction);

            let a = vec_sub(f.origin, state.position);
            let b = f.direction;

            torque += a[0] * b[1] - a[1] * b[0];
          })



          let a = vec_scale(force, 1 / m);
          state.velocity = vec_add(state.velocity, vec_scale(a, dt));
          state.position = vec_add(state.position, vec_scale(state.velocity, dt));

          let ddalpha = torque / I;
          state.dalpha += ddalpha * dt;
          state.alpha += state.dalpha * dt;
        } else if (mode === "force5a") {

          dt *= 5;
          let force = [slider_args[0], 0];

          force[0] -= max(0, state.position[0]) * wall_k;
          force[0] -= state.velocity[0] * 3;

          let a = vec_scale(force, 1 / m);
          state.velocity = vec_add(state.velocity, vec_scale(a, dt));
          state.position = vec_add(state.position, vec_scale(state.velocity, dt));
        } else if (mode === "force12") {

          dt *= 4;

          let iter = 16;

          dt /= iter;
          for (let i = 0; i < iter; i++) {
            let force = [0, 1];

            force[1] -= max(0, state.position[1]) * 200;
            force[1] -= state.velocity[1] * (state.position[1] < 0 ? 1 : 8);


            let a = vec_scale(force, 1 / m);
            state.velocity = vec_add(state.velocity, vec_scale(a, dt));
            state.position = vec_add(state.position, vec_scale(state.velocity, dt));
            state.ff = max(0, max(0, state.position[1]) * 200 + state.velocity[1] * (state.position[1] < 0 ? 0 : 8));
          }
          cog = true;
        }

        if (mode === "force3") {
          if (sim_slider && sim_slider.dragged) {

            state.dragged = true;
            state.slider = slider_args[0];
            state.slider_t = 0.0;

          } else {

            if (state.dragged) {
              state.dragged = false;
            }

            state.slider_t += dt;


            let val = lerp(state.slider, 0.5, smooth_step(0, 0.15, state.slider_t));
            sim_slider.set_value(val);

            slider_args[0] = val;

          }
        }


        let size = ceil(width * 0.15);


        ctx.translate(round(width / 2), round(height / 2));

        if (mode === "force1" || mode === "force2" || mode === "force3") {
          ctx.translate(0, round(-width * 0.03));
        }


        if (mode === "force5b")
          ctx.translate(-height / 2, 0);

        if (mode === "force13")
          ctx.translate(-height * 0.5, -height * 0.05);

        if (mode === "force2") {

          ctx.translate(0, -height * 0.3);
          ctx.save();
          ctx.translate(-width * 0.3, 0);

          draw_box(state.position, state.alpha, size, size);

          let b = state.position.slice();
          b[0] -= 0.5;

          let a = b.slice();
          a[0] -= slider_args[0];

          ctx.fillStyle = force_color_css[0];
          ctx.strokeStyle = force_color_css[1];

          draw_force(a, b, size);
          let small_size = size / 1.41;
          ctx.restore();

          ctx.translate(+small_size / 2 - size / 2, height * 0.55);



          ctx.save();

          ctx.strokeStyle = "#aaa";
          ctx.setLineDash([height * 0.015, height * 0.015]);
          ctx.strokeLine(-width, -height * 0.16, width, -height * 0.16);
          ctx.setLineDash([]);

          ctx.translate(-width * 0.3, 0);


          draw_box(vec_scale(state.position, 2), state.alpha, small_size, size);

          b = state.position.slice();
          b[0] *= 2;
          b[0] -= 0.5 / 1.41;

          a = b.slice();
          a[0] -= slider_args[0];

          ctx.fillStyle = force_color_css[0];
          ctx.strokeStyle = force_color_css[1];

          draw_force(a, b, size);

          ctx.restore();
        } else if (mode === "force4" || mode === "force5" || mode === "force5b" || mode === "force5a" ||
          mode === "force6" || mode === "force7") {

          if (mode === "force5a") {
            ctx.translate(-size, 0);
          }

          if (mode === "force7")
            ctx.translate(-size / 2, 0);


          if (mode === "force6" || mode === "force7") {
            ctx.save();
            if (mode !== "force7") {
              ctx.rect(-size * 2.5, -height, size * 2, height * 2);
              ctx.clip();
            }

            draw_box([-1, 0], 0, size, size);

            ctx.restore();

            ctx.save();
            if (mode !== "force7") {
              ctx.rect(-size * 0.5, -height, size, height * 2);
              ctx.clip();
              draw_box([0, 0], 0, size, size);
            } else {
              draw_box([2, 0], 0, size, size);
            }


            ctx.restore();
          } else {
            draw_box([0, 0], 0, size, size);
          }

          if (mode !== "force7") {

            if (mode === "force5b") {
              ctx.translate(height, 0);
            }


            ctx.lineWidth = size * 0.015;
            ctx.beginPath();
            ctx.rect(size / 2, -height, size / 2, height * 2);
            ctx.fillStyle = "#ccc";
            ctx.strokeStyle = "#333";

            ctx.save();
            ctx.shadowColor = "rgba(0,0,0,0.3)";
            ctx.shadowBlur = 0.15 * size;
            ctx.shadowOffsetY = 0;


            ctx.fill();
            ctx.restore();

            ctx.stroke();

            if (mode === "force5b") {
              ctx.translate(-height, 0);
            }
          }

          let b = state.position.slice();

          if (mode === "force5a")
            b[0] = 0;

          b[0] -= 0.5;

          let a = b.slice();
          a[0] -= slider_args[0] * 0.8;


          ctx.fillStyle = force_color_css[0];
          ctx.strokeStyle = force_color_css[1];


          if (mode === "force5" || mode === "force5a" || mode === "force5b" || mode === "force6" || mode === "force7") {

            if (mode === "force5" || mode === "force5a" || mode === "force5b") {
              draw_force(a, b, size);
            } else {
              a[0] -= 1;
              b[0] -= 1;
              draw_force(a, b, size);

              a[0] += 1;
              b[0] += 1;

              if (mode === "force7") {
                a[0] += 2;
                b[0] += 2;
              }

              ctx.fillStyle = "#888";
              ctx.strokeStyle = "#333";

              draw_force(a, b, size);

              if (mode === "force7") {
                a[0] -= 2;
                b[0] -= 2;
              }
            }



            ctx.fillStyle = force1_color_css[0];
            ctx.strokeStyle = force1_color_css[1];

            a[0] += 1;
            b[0] += 1;

            if (mode === "force5b")
              ctx.translate(height, 0);

            if (mode === "force5a") {
              a[0] += slider_args[0] * 0.8;
              a[0] -= max(0, state.position[0]) * wall_k * 0.8;
            }

            if (mode !== "force7")
              draw_force(a, b, size);

            if (mode === "force5b")
              ctx.translate(-height, 0);


            if (mode === "force7") {
              a[0] += 2;
              b[0] += 2;
            }

            ctx.fillStyle = force2_color_css[0];
            ctx.strokeStyle = force2_color_css[1];

            a[0] += slider_args[0] * 0.8 * 2;

            if (mode === "force5a") {
              a[0] -= slider_args[0] * 0.8 * 2;
              a[0] += max(0, state.position[0]) * wall_k * 0.8 * 2;
            }

            draw_force(a, b, size);

            if (mode === "force6" || mode === "force7") {

              ctx.fillStyle = "#FFD063";
              ctx.strokeStyle = "#6E5A2C";

              a[0] -= 1;
              b[0] -= 1;
              if (mode === "force7") {
                a[0] -= 2;
                b[0] -= 2;
              }
              draw_force(a, b, size);
            }


          } else {
            draw_force(a, b, size);

          }

          if (mode === "force5a") {

            let rr = ceil(height * 0.4);
            ctx.save();

            ctx.translate(size * 2.5, 0);
            ctx.beginPath();
            ctx.rect(-rr, -rr, rr * 2, rr * 2);
            ctx.clip();

            ctx.save();

            ctx.translate(state.position[0] * size, 0);

            ctx.fillStyle = "#CFA275";

            ctx.fillRect(-rr * 2, -rr, rr * 2, rr * 2);
            ctx.fillStyle = "#8D694B";
            ctx.fillRect(-size / 40, -rr, size / 40, rr * 2);

            ctx.translate(-state.position[0] * size, 0);
            ctx.translate(max(0, state.position[0]) * size, 0);

            ctx.fillStyle = "#ccc";

            ctx.fillRect(0, -rr, rr * 2, rr * 2);
            ctx.fillStyle = "#555"

            ctx.fillRect(0, -rr, size / 40, rr * 2);

            ctx.restore();

            ctx.globalCompositeOperation = "destination-in";
            ctx.fillEllipse(0, 0, rr);

            ctx.restore();

            let scale = 70;
            draw_zoom(rr, rr / scale, [size * 2.5, 0], [size / 2, size / 4]);

          }


        } else if (mode === "force12") {

          ctx.translate(-width / 4, 0)

          for (let side = 0; side < 2; side++) {


            let kk = 0.9;
            ctx.save();
            ctx.translate(0, size / 2);


            ctx.strokeStyle = "#333";
            ctx.fillStyle = "#ddd";
            ctx.fillRect(-width / 4, 0, width / 2, height);
            ctx.strokeLine(-width / 4, 0, width / 4, 0);

            ctx.fillStyle = force1_color_css[0];
            ctx.strokeStyle = force1_color_css[1];


            let n = 8;

            if (side == 0) {

              let ss = kk * state.ff * size / sqrt(n);
              for (let i = 0; i < n; i++) {
                let x = (i + 0.5 - n / 2) / n * size;


                ctx.arrow(x, 0 + ss * 0.5, x, 0, 0.1 * ss, 0.25 * ss, 0.3 * ss);
                ctx.fill();
                ctx.stroke();
              }
            } else {
              let ss = kk * state.ff * size;
              ctx.arrow(0, 0 + ss * 0.5, 0, 0, 0.1 * ss, 0.25 * ss, 0.3 * ss);
              ctx.fill();
              ctx.stroke();
            }
            ctx.restore();

            ctx.save();
            ctx.translate(state.position[0], state.position[1] * size);
            draw_box([0, 0], 0, size, size);

            ctx.fillStyle = force_color_css[0];
            ctx.strokeStyle = force_color_css[1];

            if (side == 0) {

              let ss = kk * size / n;
              for (let i = 0; i < n; i++) {
                let x = (i + 0.5 - n / 2) / n * size;

                for (let j = 0; j < n; j++) {
                  let y = (j + 0.5 - n / 2) / n * size;

                  ctx.arrow(x, y, x, y + ss * 0.5, 0.1 * ss, 0.25 * ss, 0.3 * ss);
                  ctx.fill();
                  ctx.stroke();
                }
              }
            } else {
              let ss = kk * size;
              ctx.arrow(0, 0, 0, 0 + ss * 0.5, 0.1 * ss, 0.25 * ss, 0.3 * ss);
              ctx.fill();
              ctx.stroke();
            }
            ctx.restore();


            ctx.translate(width / 2, 0)

            ctx.feather(width * 0.5 * scale, height * scale,
              canvas.height * 0.3, canvas.height * 0.3,
              canvas.height * 0.0, canvas.height * 0.0, side * width, 0);


          }

          ctx.translate(-width * 3 / 4, 0);

          ctx.strokeStyle = "#aaa";
          ctx.setLineDash([height * 0.01, height * 0.02]);
          ctx.strokeLine(0, -height * 0.5, 0, height * 0.5);

        } else {

          if (mode === "force9") {
            ctx.translate(0, -height * 0.25);
            draw_box(state.position, state.alpha / 4, size, size);
            ctx.translate(0, height * 0.5);
          }
          draw_box(state.position, state.alpha, size, size);

          if (mode === "force13") {
            ctx.beginPath();
            ctx.lineTo(size / 2, size / 2);
            ctx.lineTo(size / 2, -height);
            ctx.lineTo(size, -height);
            ctx.lineTo(size, size);
            ctx.lineTo(-width, size);
            ctx.lineTo(-width, size / 2);
            ctx.closePath();

            ctx.lineWidth = size * 0.015;
            ctx.fillStyle = "#ccc";
            ctx.strokeStyle = "#333";

            ctx.save();
            ctx.shadowColor = "rgba(0,0,0,0.3)";
            ctx.shadowBlur = 0.15 * size;
            ctx.shadowOffsetY = 0;


            ctx.fill();
            ctx.restore();

            ctx.stroke();
          }

          let c = cos(state.alpha);
          let s = sin(state.alpha);

          let points = [
            [-0.5, -0.5],
            [-0.5, 0.5],
            [0.5, 0.5],
            [0.5, -0.5]
          ].map(p => {
            return [p[0] * c - p[1] * s + state.position[0],
              p[0] * s + p[1] * c + state.position[1]
            ];
          });

          draw_forces(points);

          if (mode === "force9") {

            forces[0].origin[1] /= 4;
            let c = cos(state.alpha / 4);
            let s = sin(state.alpha / 4);

            let points = [
              [-0.5, -0.5],
              [-0.5, 0.5],
              [0.5, 0.5],
              [0.5, -0.5]
            ].map(p => {
              return [p[0] * c - p[1] * s + state.position[0],
                p[0] * s + p[1] * c + state.position[1]
              ];
            });

            ctx.translate(0, -height * 0.5);
            draw_forces(points);
          } else if (mode === "force13") {


            ctx.save();
            ctx.globalCompositeOperation = "destination-over";
            ctx.translate(-size / 2, -size / 4);
            ctx.globalAlpha = 0.8;
            ctx.lineWidth = size * 0.03;
            ctx.strokeStyle = force5_color_css[0];
            ctx.setLineDash([height * 0.01, height * 0.02]);
            ctx.strokeLine(0, 0, -1.2 * slider_args[0] * size, 0);
            ctx.strokeStyle = force4_color_css[0];
            ctx.strokeLine(-1.2 * slider_args[0] * size, 0,
              -1.2 * slider_args[0] * size, -0.6 * slider_args[0] * size);
            ctx.restore();

            ctx.translate(size * 2, 0);

            ctx.strokeStyle = "#aaa";
            ctx.setLineDash([height * 0.01, height * 0.02]);
            ctx.strokeLine(0, -height * 0.5, 0, height * 0.5);


            ctx.setLineDash([]);

            ctx.translate(size / 2, -size / 4);

            let p0 = [0, 0];
            for (let f of forces) {

              let b = vec_add(p0, f.direction);
              let a = p0;

              ctx.fillStyle = f.color[0];
              ctx.strokeStyle = f.color[1];

              draw_force(a, b, size);

              p0 = b;
            }

            ctx.save();
            ctx.globalCompositeOperation = "destination-over";
            ctx.translate(p0[0], p0[1]);
            ctx.translate(1.2 * slider_args[0] * size, 0.6 * slider_args[0] * size);
            ctx.globalAlpha = 0.8;
            ctx.lineWidth = size * 0.03;
            ctx.strokeStyle = force5_color_css[0];
            ctx.setLineDash([height * 0.01, height * 0.02]);
            ctx.strokeLine(0, 0, -1.2 * slider_args[0] * size, 0);
            ctx.strokeStyle = force4_color_css[0];

            ctx.strokeLine(-1.2 * slider_args[0] * size, 0,
              -1.2 * slider_args[0] * size, -0.6 * slider_args[0] * size);
            ctx.restore();

          }

          function draw_forces(points) {


            if (cog) {
              forces.forEach(f => {

                let len = vec_len(f.direction);

                if (len == 0)
                  return;

                ctx.strokeStyle = "rgba(0,0,0,0.2)";
                ctx.lineWidth = size / 50;
                ctx.setLineDash([size / 18, size / 15]);

                ctx.globalAlpha = sharp_step(0, 0.1, len);

                ctx.strokeLine(size * (f.origin[0]),
                  size * (f.origin[1]),
                  size * (f.origin[0] + f.direction[0] * 40 / len),
                  size * (f.origin[1] + f.direction[1] * 40 / len));


                if (mode === "force9" || mode === "force10" || mode === "force11") {


                  ctx.save();
                  ctx.globalAlpha *= 0.9;
                  ctx.lineCap = "butt";
                  ctx.setLineDash([]);
                  ctx.lineWidth = size / 30 + size / 70;
                  ctx.strokeStyle = f.color ? f.color[1] : force_color_css[1];

                  ctx.beginPath();
                  ctx.lineTo(size * state.position[0], size * state.position[1]);
                  ctx.lineTo(size * state.position[0], size * f.origin[1]);

                  ctx.stroke();
                  ctx.restore();
                }


              });

              ctx.globalAlpha = 1;

            }


            forces.forEach(f => {

              function intersect(p, r, q, s) {

                let a = vec_sub(q, p);

                let u = (-a[0] * r[1] + a[1] * r[0]) / -(r[0] * s[1] - r[1] * s[0]);

                if (saturate(u) != u)
                  return Infinity;

                return (a[0] * s[1] - a[1] * s[0]) / (r[0] * s[1] - r[1] * s[0]);
              }

              let t_min = Infinity;

              for (let i = 0; i < 4; i++) {
                t_min = min(t_min, intersect(f.origin, f.direction, points[i], vec_sub(points[(i + 1) & 3], points[i])));;
              }

              let b = vec_add(f.origin, vec_scale(f.direction, t_min));
              let a = vec_sub(b, f.direction);

              if (f.color) {
                ctx.fillStyle = f.color[0];
                ctx.strokeStyle = f.color[1];
              } else {
                ctx.fillStyle = force_color_css[0];
                ctx.strokeStyle = force_color_css[1];
              }

              draw_force(a, b, size);

              if (mode === "force11") {
                ctx.save();
                ctx.globalAlpha = 0.5;
                ctx.scale(size, size);
                ctx.fillRect(a[0], a[1], b[0] - a[0], -a[1]);
                ctx.restore();
              }
            });

          }
        }

        function draw_speedometer(val) {
          let s = width * 0.03;
          ctx.fillStyle = "#fdfdfd";

          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.3)";
          ctx.shadowBlur = s * 0.4;
          ctx.shadowOffsetY = s * 0.2;
          ctx.fillEllipse(0, 0, s);
          ctx.restore();

          ctx.lineWidth = 1;
          ctx.strokeStyle = "#444";
          ctx.save();
          ctx.rotate(pi * 0.8);

          ctx.save()

          let n = 28;
          for (let i = 0; i <= n; i++) {

            ctx.strokeLine(s * ((i & 3) == 0 ? 0.7 : 0.85), 0, s - 2, 0);
            ctx.rotate(1.4 * pi * 1 / n);
          }
          ctx.restore();

          ctx.rotate(val);

          ctx.fillStyle = ctx.strokeStyle = "#DF6C52";
          ctx.beginPath();
          ctx.lineTo(s - 2, 0);
          ctx.lineTo(0, s * 0.04);
          ctx.lineTo(0, -s * 0.04);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#333";
          ctx.fillEllipse(0, 0, s * 0.1);

          ctx.restore();

          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "#666";
          ctx.strokeEllipse(0, 0, s);
        }


        let tb_feather = mode === "force9" || mode === "force2" ? 0 : canvas.height * 0.15;
        ctx.feather(width * scale, height * scale,
          canvas.height * 0.15, canvas.height * 0.15, tb_feather, tb_feather);


        if (mode === "force1") {
          ctx.save();
          ctx.translate(0, height * 0.45);
          draw_speedometer(state.velocity[0]);
          ctx.restore();
        } else if (mode === "force2") {
          ctx.save();
          ctx.translate(0, -height * 0.28);
          draw_speedometer(state.velocity[0]);
          ctx.translate(0, height * 0.48);
          draw_speedometer(state.velocity[0] * 2);
          ctx.restore();
        } else if (mode === "force3") {
        ctx.save();
        ctx.translate(0, height * 0.45);
        draw_speedometer(abs(state.velocity[0]));
        ctx.restore();
        }


        function draw_force(a, b, size) {

          ctx.save();
          ctx.scale(size, size);
          ctx.lineWidth = 1 / 65;



          let len = vec_len(vec_sub(a, b));
          let scale = sharp_step(0, 0.4, len);

          ctx.arrow(a[0], a[1], b[0], b[1], 0.1 * scale, 0.25 * scale, 0.3 * scale);

          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        function draw_box(pos, alpha, size, base_size) {
          ctx.save();
          ctx.translate(pos[0] * base_size, pos[1] * base_size);
          ctx.rotate(alpha);

          ctx.translate(-size * 0.5, -size * 0.5);
          ctx.fillStyle = "#000";

          {
            ctx.save();
            ctx.shadowColor = "rgba(0,0,0,0.3)";
            ctx.shadowBlur = 0.3 * base_size;
            ctx.shadowOffsetY = 0;
            ctx.fillRect(0, 0, size, size);

            ctx.shadowColor = "rgba(0,0,0,0.6)";
            ctx.shadowBlur = 0.1 * base_size;
            ctx.shadowOffsetY = 0;
            ctx.fillRect(0, 0, size, size);
            ctx.restore();
          }



          let ww = size / 8;

          {
            ctx.save();

            ctx.fillStyle = "#000";
            ctx.shadowColor = "#D6B898";
            ctx.shadowBlur = 0.08 * size;
            ctx.shadowOffsetY = 0;
            ctx.globalCompositeOperation = "lighter";
            ctx.fillRect(ww, ww, size - ww * 2, size - ww * 2);

            ctx.restore();
          }

          ctx.lineWidth = size / 80;
          ctx.strokeStyle = "rgba(0,0,0,0.15)";
          let n = 11;
          for (let i = 0; i < n; i++) {
            ctx.fillStyle = rgba_color_string(
              [0.2 + 0.15 * hash(i),
                0.2 + 0.15 * hash(i + 100),
                0.2 + 0.15 * hash(i + 200), 0.08
              ]);
            ctx.beginPath();
            ctx.rect(i / n * size, 0, size / n, size);
            ctx.fill();
            ctx.stroke();
          }

          ctx.lineWidth = size / 50;

          ctx.fillStyle = "#D6B898";
          ctx.strokeStyle = "#8D694B"

          {
            ctx.save();
            ctx.translate(size / 2, size / 2);
            ctx.rotate(pi / 4);
            ctx.translate(-size * 0.6, -ww / 2);

            ctx.fillStyle = "#D4AF8A";
            ctx.shadowColor = "#333";
            ctx.shadowBlur = 0.08 * size;
            ctx.shadowOffsetY = 0;

            ctx.beginPath();
            ctx.rect(0, 0, size * 1.2, ww);
            ctx.fill();
            ctx.shadowColor = "rgba(0,0,0,0)";
            ctx.stroke();
            ctx.restore();
          }

          ctx.fillStyle = "#C09F7D";
          ctx.beginPath();
          ctx.rect(ww, 0, size - ww * 2, ww);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#D4AF8A";
          ctx.beginPath();
          ctx.rect(ww, size - ww, size - ww * 2, ww);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#D4B595";
          ctx.beginPath();
          ctx.rect(0, 0, ww, size);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#CFA375";
          ctx.beginPath();
          ctx.rect(size - ww, 0, ww, size);
          ctx.fill();
          ctx.stroke();

          let r = size * 0.012;
          ctx.fillStyle = "#666";

          ctx.fillEllipse(ww / 4, ww / 4, r);
          ctx.fillEllipse(ww * 3 / 4, ww / 4, r);

          ctx.fillEllipse(size - ww / 4, ww / 4, r);
          ctx.fillEllipse(size - ww * 3 / 4, ww / 4, r);

          ctx.fillEllipse(ww / 4, size - ww / 4, r);
          ctx.fillEllipse(ww * 3 / 4, size - ww / 4, r);

          ctx.fillEllipse(size - ww / 4, size - ww / 4, r);
          ctx.fillEllipse(size - ww * 3 / 4, size - ww / 4, r);

          ctx.fillEllipse(ww + ww / 4, ww / 4, r);
          ctx.fillEllipse(ww + ww / 4, ww * 3 / 4, r);

          ctx.fillEllipse(size - ww - ww / 4, ww / 4, r);
          ctx.fillEllipse(size - ww - ww / 4, ww * 3 / 4, r);

          ctx.fillEllipse(ww + ww / 4, size - ww / 4, r);
          ctx.fillEllipse(ww + ww / 4, size - ww * 3 / 4, r);

          ctx.fillEllipse(size - ww - ww / 4, size - ww / 4, r);
          ctx.fillEllipse(size - ww - ww / 4, size - ww * 3 / 4, r);

          ctx.fillEllipse(ww + ww / 2, ww + ww / 4, r);
          ctx.fillEllipse(ww + ww / 4, ww + ww / 2, r);

          ctx.fillEllipse(size - ww - ww / 2, size - ww - ww / 4, r);
          ctx.fillEllipse(size - ww - ww / 4, size - ww - ww / 2, r);


          ctx.translate(size / 2, size / 2);

          if (cog)
            draw_cog(size / 15);

          ctx.restore();



        }

      } else if (mode.startsWith("bike_force") || mode === "hero") {


        function base_pedal_force_y(a) {
          let f = 0;
          f += -3.5 * Math.pow(sin(a) * 0.5 + 0.5, 2);
          f += -0.7 * Math.pow(sin(a - 2) * 0.5 + 0.5, 2.0);

          return f * 300 / 3.565;
        }

        function base_pedal_force_x(a) {
          let f = 0;
          f += 1.2 * sin(a + 0.5);
          f += 1.2 * Math.pow(sin(a + 0.5) * 0.5 + 0.5, 4);
          f -= 1.0 * Math.pow(sin(a - 2) * 0.5 + 0.5, 4);
          f -= 0.3 * Math.pow(sin(a + 2) * 0.5 + 0.5, 6);

          return f * 60 / 2.049;
        }


        function base_pedal_angle(a) {
          a += pi;
          let f = 0;
          f += sin(a - 0.1) * 1.5 - 0.7;
          f -= 0.5 * Math.pow(Math.cos(a - 5.6) * 0.5 + 0.5, 3.0);

          return f / 2.55 * pi / 4;
        }

        function base_arm_force(torso_angle) {
          return -Math.pow(smooth_step(-0.7, -1.5, torso_angle), 0.4) * human_weight * 0.2;
        }

        let velocity = undefined;


        let v0 = 4.1;

        const tilt_max = 0.4;


        let seat_position = vec_add(seat, [-60, 190, 0]);

        let bike_rot = mat3_mul(rot_y_mat3(pi / 2), rot_x_mat3(-pi / 2));

        let hill_angle = 0;
        let crank_angle = 1.3;
        let steer_angle = 0;
        let torso_angle = -0.8;
        let torso_tilt = 0;

        let hand_positions = handle_bar_positions(steer_angle);
        let hand_directions = [vec_norm(vec_sub(hand_positions[1], hand_positions[0])),
          vec_norm(vec_sub(hand_positions[1], hand_positions[0]))
        ];


        let brake_angles = [0, 0];
        let finger_bends = [1.7, 1.7];

        let rear_wheel_angle = 0;
        let front_wheel_angle = 0;

        let cog_rotation_angle = 0;
        let cog_tilt = 0;
        let cog_translation = [0, 0, 0];

        let background_angle = 0;
        let base_duration = 1;

        let draws_cog = true;

        if (mode === "bike_force1" || mode === "bike_force2" ||
          mode === "bike_force3") {
          torso_angle = lerp(0.0, -1.5, slider_args[0]);
          let a = pi / 2 * smooth_step(-0.7, -1.0, torso_angle);
          finger_bends = [a, a];
        }

        let steer_angle_func = function() {
          return steer_angle;
        }

        if (mode === "bike_force1") {
          draws_cog = false;
        } else if (mode === "bike_force4") {
          crank_angle = t * 2;
          torso_angle = -0.9 + sin(crank_angle * 2) * 0.006;
          rear_wheel_angle = front_wheel_angle = crank_angle * gear_ratio;
        } else if (mode.startsWith("bike_force_wheels")) {
          crank_angle = t;
          torso_angle = lerp(0.0, -1.5, slider_args[0]) + sin(crank_angle * 2) * 0.006;
          rear_wheel_angle = front_wheel_angle = crank_angle * gear_ratio;
        } else if (mode === "bike_force_pedal") {
          crank_angle = t * 4;
        } else if (mode === "bike_force_pedal_press" || mode === "bike_force_lateral") {
          crank_angle = t * 4;
        } else if (mode === "bike_force_lateral2") {
          torso_tilt = (slider_args[0] - 0.5) * 1.7;
        } else if (mode === "bike_force_brake_rear") {
          torso_angle = -1.1;

          let p = vec_add(front_up, vec_scale(steer_axis, 100));

          hand_positions = [
            vec_add(p, [210, -40, -210]),
            vec_add(p, [240, -60, +220])
          ];

          hand_directions = [vec_norm([+1, +0.2, 0]),
            vec_norm([-1, -0.8, 0])
          ];

          finger_bends = [
            1, slider_args[0],
          ];

          brake_angles = [0, -slider_args[0] * 0.5];

        } else if (mode === "bike_force_brake_front" || mode === "bike_force_brake_front2") {

          torso_angle = -1.1;

          let p = vec_add(front_up, vec_scale(steer_axis, 100));

          hand_positions = [
            vec_add(p, [240, -60, -220]),
            vec_add(p, [210, -40, +210])
          ];

          hand_directions = [vec_norm([+1, +0.8, 0]),
            vec_norm([-1, -0.2, 0])
          ];

          finger_bends = [
            slider_args[0],
            1,
          ];

          brake_angles = [-slider_args[0] * 0.5, 0];


        } else if (mode === "bike_force_handlebars" || mode === "bike_force_handlebars2") {
          base_duration = 0.8
          t = slider_args[0] * base_duration;
          rear_wheel_angle = front_wheel_angle = v0 * t * 1000 / tire_outer_R;
          crank_angle = front_wheel_angle / gear_ratio;

          steer_angle_func = function(t) {
            return 0.14388 * (smooth_step(0.3, 0.5, t) - smooth_step(0.5, 0.7, t));
          }

          steer_angle = steer_angle_func(t);

          hand_positions = handle_bar_positions(steer_angle)
        } else if (mode === "hero") {

          rear_wheel_angle = front_wheel_angle = v0 * t * 1000 / tire_outer_R;
          crank_angle = front_wheel_angle / gear_ratio;

          let target_tilt = (slider_args[0] - 0.5) * 0.5;

          let c0 = -1.7;
          let c1 = -0.15;

          steer_angle = 0;

          if (state) {
            steer_angle = (state.tilt - target_tilt) * c0 + state.dtilt * c1;
          }
          hand_positions = handle_bar_positions(steer_angle)

        } else if (mode === "bike_force_tangent") {

          steer_angle = -0.8 * (slider_args[0] - 0.5);
          cog_tilt = 0.1 * (slider_args[0] - 0.5);
          hand_positions = handle_bar_positions(steer_angle)

        } else if (mode === "bike_force_cornering" || mode === "bike_force_cornering_intro") {

          steer_angle = 0.2;
          rear_wheel_angle = front_wheel_angle = v0 * t * 1000 / tire_outer_R;
          crank_angle = front_wheel_angle / gear_ratio;

          hand_positions = handle_bar_positions(steer_angle)

        } else if (mode === "bike_force_cornering2") {
          base_duration = 0.62;
          t = slider_args[0] * base_duration;

          rear_wheel_angle = front_wheel_angle = v0 * t * 1000 / tire_outer_R;
          crank_angle = front_wheel_angle / gear_ratio;

          steer_angle_func = function(t) {
            let tt = 0.075;
            return 0.2 + tt * smooth_step(0.2, 0.3, t) - smooth_step(0.25, 0.60, t) * (0.2 + tt);
          }

          steer_angle = steer_angle_func(t);
          hand_positions = handle_bar_positions(steer_angle)
        } else if (mode === "bike_force_cornering3") {
          base_duration = 0.4;
          t = slider_args[0] * base_duration;

          rear_wheel_angle = front_wheel_angle = v0 * t * 1000 / tire_outer_R;
          crank_angle = front_wheel_angle / gear_ratio;

          steer_angle_func = function(t) {
            return 0.2 * smooth_step(0.2, 0.3, t);
          }

          steer_angle = steer_angle_func(t);
          hand_positions = handle_bar_positions(steer_angle)
        } else if (mode === "bike_force_cornering4") {
          base_duration = 0.8;
          t = slider_args[0] * base_duration;

          rear_wheel_angle = front_wheel_angle = v0 * t * 1000 / tire_outer_R;
          crank_angle = front_wheel_angle / gear_ratio;

          steer_angle_func = function(t) {
            return -0.1 * smooth_step(0.2, 0.3, t) + 0.2965 * smooth_step(0.3, 0.45, t);
          }

          steer_angle = steer_angle_func(t);
          hand_positions = handle_bar_positions(steer_angle)
        } else if (mode === "bike_force_cornering5") {
          base_duration = 2;
          t = slider_args[0] * base_duration;

          rear_wheel_angle = front_wheel_angle = v0 * t * 1000 / tire_outer_R;
          crank_angle = front_wheel_angle / gear_ratio;

          steer_angle = 0.2;
          hand_positions = handle_bar_positions(steer_angle)
        } else if (mode === "bike_force_stability") {
          base_duration = 1.38;
          t = slider_args[0] * base_duration;

          rear_wheel_angle = front_wheel_angle = v0 * t * 1000 / tire_outer_R;
          crank_angle = -3

          steer_angle = 0.0;
        } else if (mode === "bike_force_stability2") {
          base_duration = 1.7;
          t = slider_args[0] * base_duration;

          rear_wheel_angle = front_wheel_angle = v0 * t * 1000 / tire_outer_R;
          crank_angle = -3

          steer_angle_func = function(t) {
            return 0.154 * (smooth_step(0.7, 0.9, t) - smooth_step(1.0, 1.2, t));
          }

          steer_angle = steer_angle_func(t);
          hand_positions = handle_bar_positions(steer_angle)
        } else if (mode === "bike_force_stability3") {
          base_duration = 1;
          t = slider_args[0] * base_duration;

          rear_wheel_angle = front_wheel_angle = v0 * t * 1000 / tire_outer_R;
          crank_angle = -3

          steer_angle = 0.0;
        } else if (mode === "bike_force_normal_rotation") {


          torso_angle = lerp(-1.5, -0.7, smooth_step(0, 0.2, slider_args[0]));

          cog_rotation_angle = Math.pow(sharp_step(0.0, 1.0, slider_args[0]), 2) * 0.2;
        } else if (mode === "bike_force_front_flip") {

          state = {};

          let rr = tire_outer_R / 1000;


          let dx = 6;
          let x = 0;

          let dy = 0;
          let y = -0.000573937864670719;

          let da = 0;
          let a = 0.0002244437382139956;



          let dfa = dx / rr;
          let fa = 0;

          let dra = dfa;
          let ra = 0;


          let dt = 0.001;
          let iter = slider_args[0] * 0.37 / dt + 1;



          let fy = 0;
          let ry;
          let fx = 0;

          let front_slip_ratio = 0;

          let wheelI = 0.16;

          function sign(x) { return x < 0 ? -1 : 1; }

          function tire_long_force(slip_ratio, fz) {

            let aa = 0.1;
            slip_ratio = clamp(slip_ratio, -aa, aa);
            return sin(slip_ratio * 0.5 * pi / aa) * fz * 0.65;
          }

          let t;
          let brake;

          for (let i = 0; i < iter; i++) {

            t = i * dt;
            fx = sign(dx) * tire_long_force(-front_slip_ratio, fy);


            brake = smooth_step(0.05, 0.1, t);

            let front_brake_clamp_force = -1500 * brake * smooth_step(0, 0.1, dfa);


            let ground_k = 8e5;


            if (dfa <= 0) {
              front_brake_clamp_force = fx;
              dfa = 0;
            }

            if (dx < 0) {
              dx = 0;
              if (dfa == 0) {
                front_slip_ratio = 0;
              }
            }

            let front_moment = 0;
            front_moment += front_brake_clamp_force * rr;
            front_moment += -fx * rr;

            dfa += front_moment / wheelI * dt;
            fa += dfa * dt;

            front_slip_ratio += (abs(dx) - rr * dfa * sign(state.vel) - abs(dx) * front_slip_ratio) * dt;


            ra += dra * dt;





            let ddy = -total_weight;
            let ddx = 0;
            let dda = 0;



            let h = 700 / 1000;

            let h0 = h + rr;

            let to_rear = [-wheelbase * 0.4 / 1000, -h];
            let to_front = [wheelbase * 0.6 / 1000, -h];

            let c = cos(a);
            let s = sin(a);

            to_rear = [to_rear[0] * c - to_rear[1] * s, to_rear[0] * s + to_rear[1] * c];
            to_front = [to_front[0] * c - to_front[1] * s, to_front[0] * s + to_front[1] * c];



            fy = -min(0, h0 + y + (to_front[1] - rr)) * ground_k;
            ry = -min(0, h0 + y + (to_rear[1] - rr)) * ground_k;



            ddy += fy + ry;
            ddx += fx;

            dda += -(y + to_front[1] - rr) * fx;
            dda += to_front[0] * fy;
            dda += to_rear[0] * ry;

            let I = 10;


            da += dda * dt / I;
            dx += ddx * dt / total_mass;
            dy += ddy * dt / total_mass;


            x += dx * dt;
            y += dy * dt;
            a += da * dt;
          }

          fx = sign(dx) * tire_long_force(-front_slip_ratio, fy);

          state.tx = x;
          state.ty = y;
          state.fx = fx;
          state.fy = fy;
          state.ry = ry;

          front_wheel_angle = fa;
          rear_wheel_angle = ra;


          cog_translation = [0, y * 1000, 0];

          cog_rotation_angle = a;


          let p = vec_add(front_up, vec_scale(steer_axis, 100));

          hand_positions = [
            vec_add(p, [240, -60, -220]),
            vec_add(p, [210, -40, +210])
          ];



          let tt = smooth_step(0.29, 0.4, t);
          let tt2 = smooth_step(0.3, 0.4, t);
          let wrist_t = smooth_step(0.3, 0.36, t);
          let finger_t = smooth_step(0.28, 0.3, t);


          torso_angle = -1.1 + tt * 0.2;


          cog_translation[1] -= tt * 210

          seat_position[1] += tt * 100;
          seat_position[0] += tt * 200;


          hand_positions[0][0] += tt * 450;
          hand_positions[1][0] += tt2 * 450;
          hand_positions[0][1] += tt * 500;
          hand_positions[1][1] += tt2 * 500;

          hand_directions = [vec_norm([+1 * (1 - wrist_t), +0.8 - wrist_t * 0.4, wrist_t * 0.2]),
            vec_norm([-1 * (1 - wrist_t), -0.2, wrist_t * 0.2])
          ];

          finger_bends = [
            brake * (1 - finger_t),
            (1 - finger_t),
          ];

          brake_angles = [-brake * 0.5 * (1 - finger_t), 0];


          let h = smooth_step(0.8, 1.0, t) * 500;

        } else if (mode === "bike_force_longitudinal") {

          if (state2 === undefined)
            state2 = 0;
          state2 += dt * lerp(0.2, 1, slider_args[0]) * 10;

          crank_angle = state2;

        } else if (mode === "bike_force_longitudinal2") {

          if (state2 === undefined)
            state2 = 0;
          state2 += dt * lerp(0.2, 0.7, slider_args[0]) * 10;

          crank_angle = state2;
          hill_angle = 0.03;
          torso_angle = -0.9;

          draws_cog = false;

          seat_position = vec_add(seat, [50 - sin(crank_angle * 2) * 10,
            250 + sin(crank_angle * 2) * 10, 0
          ]);


        }




        let bike_mat = ident_mat4;
        bike_mat = mat4_mul(bike_mat, translation_mat4(seat_position));
        bike_mat = mat4_mul(bike_mat, rot_y_mat4(pi / 2));
        bike_mat = mat4_mul(bike_mat, rot_x_mat4(-pi / 2));
        bike_mat = mat4_mul(bike_mat, scale_mat4(200 * 186 / 98));





        let pelvis_angle = 0.4 * torso_angle;

        torso_angle += sin(t * 2) * 0.02;


        let feet_positions = cranks_positions(crank_angle);


        let pedal_forces_y = [base_pedal_force_y(crank_angle), base_pedal_force_y(crank_angle + pi)];
        let pedal_forces_x = [base_pedal_force_x(crank_angle), base_pedal_force_x(crank_angle + pi)];

        let arm_force = base_arm_force(torso_angle);
        let seat_force = -human_weight - pedal_forces_y[0] - pedal_forces_y[1] - arm_force;

        let pedal_angles = [base_pedal_angle(crank_angle), base_pedal_angle(crank_angle + pi)];


        if (mode === "bike_force_longitudinal" || mode === "bike_force_longitudinal2") {
          let s = lerp(0.1, 1.6, slider_args[0]);
          if (mode === "bike_force_longitudinal2")
            s = lerp(1.5, 2.5, slider_args[0]);
          pedal_forces_x = vec_scale(pedal_forces_x, s);
          pedal_forces_y = vec_scale(pedal_forces_y, s);
        }

        if (mode === "bike_force1" || mode === "bike_force2" || mode === "bike_force3") {
          pedal_angles = [0.1, 0.1];
          rear_wheel_angle = front_wheel_angle = t * 6;

          if (mode === "bike_force3")
            rear_wheel_angle = front_wheel_angle = t * 0.1;
        }

        let x_pos = rear_wheel_angle * tire_outer_R;


        pedal_angles[0] += sin(t * 2) * 0.03;
        pedal_angles[1] += sin(t * 2 + 2) * 0.03;

        let mats = [new Array(12), new Array(12)];

        {
          function gradient(f, params) {

            let mom = 0.9;
            let prev = new Array(params.length).fill(0);

            let k;

            let h = 0.02;
            for (k = 0; k < 350; k++) {
              let base_err = f(params);

              if (base_err < 0.1) {
                break;
              }

              let dparams = new Array(params.length);


              for (let i = 0; i < params.length; i++) {

                let pparams = params.slice();
                pparams[i] += 0.001;

                let param_err = f(pparams);

                dparams[i] = prev[i] * mom + (param_err - base_err);
              }
              let l = vec_len(dparams);
              params = vec_sub(params, vec_scale(dparams, h));


              if (l < 0.01) {
                break;
              }

              prev = dparams;

            }

            return params;
          }

          function mat34_mul(a, b) {
            /* 0  1  2  3
               4  5  6  7
               8  9 10 11*/

            let res = [];
            res[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8];
            res[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9];
            res[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10];
            res[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3];

            res[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8];
            res[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9];
            res[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10];
            res[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7];

            res[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8];
            res[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9];
            res[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10];
            res[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11];

            return res;
          }

          function mat34_mul_mat3(a, b) {
            /* 0  1  2  3
               4  5  6  7
               8  9 10 11*/

            let res = [];
            res[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
            res[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
            res[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];
            res[3] = a[3];

            res[4] = a[4] * b[0] + a[5] * b[3] + a[6] * b[6];
            res[5] = a[4] * b[1] + a[5] * b[4] + a[6] * b[7];
            res[6] = a[4] * b[2] + a[5] * b[5] + a[6] * b[8];
            res[7] = a[7];

            res[8] = a[8] * b[0] + a[9] * b[3] + a[10] * b[6];
            res[9] = a[8] * b[1] + a[9] * b[4] + a[10] * b[7];
            res[10] = a[8] * b[2] + a[9] * b[5] + a[10] * b[8];
            res[11] = a[11];

            return res;
          }

          function mat34_mul_vec3(a, b) {
            let res = [];
            res[0] = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3];
            res[1] = a[4] * b[0] + a[5] * b[1] + a[6] * b[2] + a[7];
            res[2] = a[8] * b[0] + a[9] * b[1] + a[10] * b[2] + a[11];

            return res;
          }

          if (inv_k_state === undefined) {
            inv_k_state = {};
            inv_k_state.top_angles = [];
            inv_k_state.bottom_angles = [];

            let base_top_angles = [-0.7670418058405845, 0.09852887088764198, -1.1546835869106464, 1.377263395295781, -0.059969845369499425];

            let base_bottom_angles = [-1.2, 0, 1.2];

            inv_k_state.top_angles.push(base_top_angles);
            inv_k_state.top_angles.push(base_top_angles);

            inv_k_state.bottom_angles.push(base_bottom_angles);
            inv_k_state.bottom_angles.push(base_bottom_angles);

            if (mode === "bike_force_front_flip") {
              inv_k_state = { top_angles: [
                  [-1.3632259153800879, -0.18639559746816542, -0.4104604575096116, -0.33067311063541943, -0.16404199720933285],
                  [-1.3008553687768938, -0.20733574261695847, -0.724036466944551, -0.4675757637760733, 0.5573159131065667]
                ], bottom_angles: [
                  [-1.2305623736267461, 0.015595580015098127, 1.5289686848022421],
                  [-1.4959686932414786, 0.04192861613045108, 1.4033879388021127]
                ] }
            }
          }



          for (let side = 0; side < 2; side++) {

            let mat = mats[side];
            mat[0] = rot_x_mat3(-pelvis_angle);
            mat[1] = mat3_mul(rot_x_mat3(-(torso_angle - pelvis_angle)), rot_z_mat3(-torso_tilt * (side ? 1 : -1)));

            for (let i = 2; i < 12; i++) {
              mat[i] = ident_mat3;
            }

            if (side == 1)
              mats[1][0] = mat3_mul(mats[0][0], x_flip_mat3);

            {
              let path = [0, 0, 1, 0, 0];

              let target = hand_positions[side];


              let base_angles = inv_k_state.top_angles[side];

              let distance = 0;
              let sign = side ? 1 : -1;
              base_angles = gradient(function(angles) {

                mat[4] = mat3_mul(rot_y_mat3(angles[1]), rot_x_mat3(angles[0]));
                mat[5] = rot_x_mat3(angles[2]);
                mat[6] = mat3_mul(rot_y_mat3(angles[3]), rot_x_mat3(angles[4]));

                let root = bone_hierarchy["Humanoid"][0];
                let total_mat = bike_mat;

                for (let e of path) {
                  root = root.children[e];
                  total_mat = mat34_mul(total_mat, root.parent_transform);
                  total_mat = mat34_mul_mat3(total_mat, (mat[root.index]));
                }

                let dir = vec_norm(vec_sub(mat34_mul_vec3(total_mat, [0, -0.3 * sign, sign]), mat34_mul_vec3(total_mat, [0, 0, 0])));
                let e0 = vec_len(vec_sub(target, mat34_mul_vec3(total_mat, [-0.02, 0.26, 0])));
                let e1 = (1 - vec_dot(hand_directions[side], dir)) * 200;
                // penalize bending elbows the wrong way
                let e2 = smooth_step(-0.2, 0.3, angles[2]) * 200;
                distance = e0;

                return e0 * 0.1 + e1 + e2;

              }, base_angles);

              inv_k_state.top_angles[side] = base_angles;

              {
                let t = smooth_step(20, 250, distance);

                base_angles[0] = lerp(base_angles[0], 0, t);
                base_angles[2] = lerp(base_angles[2], -1.7 * smooth_step(1.0, 0.3, t), t);
                base_angles[3] = lerp(base_angles[3], 0, t);
                base_angles[4] = lerp(base_angles[4], 0, t);

              }


              mat[4] = mat3_mul(rot_y_mat3(base_angles[1]), rot_x_mat3(base_angles[0]));
              mat[5] = rot_x_mat3(base_angles[2]);
              mat[6] = mat3_mul(rot_y_mat3(base_angles[3]), rot_x_mat3(base_angles[4]));



              mat[7] = rot_z_mat3(finger_bends[side]);
              mat[8] = rot_z_mat3(finger_bends[side]);

              mat[2] = rot_x_mat3(+torso_angle * 0.3);
              mat[3] = rot_x_mat3(+torso_angle * 0.3);

            }

            // legs
            {
              let path = [0, 1, 0, 0];

              let a = -crank_angle + pi + side * pi;
              let target = vec_add(sprocket, mat3_mul_vec(rot_z_mat3(a), [0, crank_length, 0]));;


              let base_angles = inv_k_state.bottom_angles[side];

              base_angles = gradient(function(angles) {

                mat[9] = mat3_mul(rot_z_mat3(angles[1]), rot_x_mat3(angles[0]));
                mat[10] = rot_x_mat3(angles[2]);
                mat[11] = rot_x_mat3((pelvis_angle - angles[2] - angles[0] - pedal_angles[side]));

                let root = bone_hierarchy["Humanoid"][0];
                let total_mat = bike_mat;

                for (let e of path) {
                  root = root.children[e];
                  total_mat = mat34_mul(total_mat, root.parent_transform);
                  total_mat = mat34_mul_mat3(total_mat, (mat[root.index]));
                }


                return vec_len(vec_sub(target, mat34_mul_vec3(total_mat, [-0.3, 0.3, 0.2]))) * 0.1;
              }, base_angles);


              mat[9] = mat3_mul(rot_z_mat3(base_angles[1]), rot_x_mat3(base_angles[0]));
              mat[10] = rot_x_mat3(base_angles[2]);
              mat[11] = rot_x_mat3((pelvis_angle - base_angles[2] - base_angles[0] - pedal_angles[side]));

              inv_k_state.bottom_angles[side] = base_angles;
            }


          }

        }


        let human_cog = [0, 0, 0];

        let bone_weights = {};

        bone_weights["Root"] = [0.6 * 0.51 / 2, 0.24];
        bone_weights["Spine"] = [0.35 * 0.51 / 2, 0.52];
        bone_weights["Neck"] = [0.05 * 0.51 / 2, 0.11];
        bone_weights["Head"] = [0.068 / 2, 0.4];
        bone_weights["Arm"] = [0.028, 0.4];
        bone_weights["Forearm"] = [0.022, 0.28];
        bone_weights["Thigh"] = [0.1, 0.3];
        bone_weights["Shin"] = [0.061, 0.55];

        for (let side = 0; side < 2; side++) {

          let root = bone_hierarchy["Humanoid"][0];

          function recurse(mat, bone) {
            let weights = bone_weights[bone.name];
            if (!weights)
              return;

            let local = mat3_to_mat4(mats[side][bone.index]);
            let parent = bone.parent_transform;

            mat = mat4_mul(mat, mat4_mul(parent, local));
            let total_mat = mat4_mul(bike_mat, mat);

            human_cog = vec_add(human_cog, vec_scale(mat4_mul_vec3(total_mat, [0, weights[1], 0.0]), weights[0]));

            if (bone.children) {
              bone.children.forEach(child => {
                recurse(mat, child);
              })
            }
          }

          recurse(bone_hierarchy["Humanoid"][0].parent_transform, bone_hierarchy["Humanoid"][0].children[0]);
        }


        let cog = vec_scale(vec_add(vec_scale(human_cog, human_mass), vec_scale(bike_cog, bike_mass)), 1 / total_mass);


        let cop = [333, 780 + cos(2 * crank_angle), 0];

        if (mode === "bike_force1" || mode === "bike_force2") {

          let h = -arm_force;

          let rs = seat_position[0] - human_cog[0];
          let rp0 = feet_positions[0][0] - human_cog[0];
          let rp1 = feet_positions[1][0] - human_cog[0];
          let rh = hand_positions[0][0] - human_cog[0];

          let rr = (rp0 + rp1) * 0.5;
          seat_force = -(-rh * h - rr * (human_weight - h)) / (rs - rr);
          pedal_forces_y[0] = pedal_forces_y[1] = -(human_weight - h + seat_force) * 0.5;
        }


        let mvp_translation = -0.45;
        let wheel_separation = 0;
        let wheel_separation_down = 0;
        let draw_scale = 0.84;

        let front_rot = 0;

        let front_only = true;

        let forces = [];
        let forces3d = [];
        let lines = [];

        let s = width * 0.15;



        if (mode === "bike_force_wheels2") {
          draw_scale = 0.6;
          mvp_translation = -0.4;
          wheel_separation = tire_outer_R + 250;
          wheel_separation_down = 420;
        }


        let rry = cog[1] + tire_outer_R;
        let rrx = cog[2];
        let rr = sqrt(rry * rry + rrx * rrx);



        if (mode === "bike_force_brake_rear" || mode === "bike_force_brake_front" ||
          mode === "bike_force_brake_front2" || mode === "bike_force_longitudinal" ||
          mode === "bike_force_longitudinal2" ||
          mode === "bike_force_pedal") {
          if (state === undefined) {
            state = {};
            state.vel = 10;

            if (mode === "bike_force_longitudinal")
              state.vel = 2;
            else if (mode === "bike_force_longitudinal2") {
              state.vel = 4;
            } else if (mode === "bike_force_pedal")
              state.vel = 5.5;

            state.pos = 0;
            state.rear_slip_ratio = 0;
            state.rear_omega = state.vel / (tire_outer_R / 1000);
            state.rear_angle = 0;
            state.front_slip_ratio = 0;
            state.front_omega = state.vel / (tire_outer_R / 1000);
            state.front_angle = 0;

            state.rear_normal = total_weight * (1 - cog[0] / wheelbase) * cos(hill_angle);
            state.front_normal = total_weight * (cog[0] / wheelbase) * cos(hill_angle);

            state.tstart = -1;
            state.tend = -1;
          }

          if (slider_args[0] != 0 && state.tstart == -1)
            state.tstart = t;

          function tire_long_force(slip_ratio, fz) {

            slip_ratio = clamp(slip_ratio, -0.1, 0.1);
            return slip_ratio * 10 * fz;
            let aa = 0.1;
            slip_ratio = clamp(slip_ratio, -aa, aa);
            return sin(slip_ratio * 0.5 * pi / aa) * fz;
          }

          let rear_force;
          let front_force;
          let aero_force = 0;
          let iter = 1024;
          let tt = dt / iter;

          let rear_brake_clamp_force = 0;
          let front_brake_clamp_force = 0;

          for (let i = 0; i < iter; i++) {

            let omega0 = state.vel / (tire_outer_R / 1000);


            let pedal_force = 0;

            aero_force = 0;
            let wheelI = 0.16;

            if (mode === "bike_force_brake_rear") {
              rear_brake_clamp_force = -slider_args[0] * 500 * sign(state.rear_omega) * smooth_step(0, 0.1, state.rear_omega);
            } else if (mode === "bike_force_brake_front2") {
              front_brake_clamp_force = -slider_args[0] * 300 * sign(state.front_omega) * smooth_step(0, 0.1, state.front_omega);
              draws_cog = false;
            } else if (mode === "bike_force_brake_front") {
              front_brake_clamp_force = -slider_args[0] * 500 * sign(state.front_omega) * smooth_step(-0.1, 1, abs(state.front_omega));
            } else if (mode === "bike_force_longitudinal" ||
              mode === "bike_force_pedal" || mode === "bike_force_longitudinal2") {

              let m0 = pedal_forces_x[0] * cos(crank_angle) + pedal_forces_y[0] * sin(crank_angle);
              let m1 = -pedal_forces_x[1] * cos(crank_angle) - pedal_forces_y[1] * sin(crank_angle);

              pedal_force = min(0, m0 + m1);

              aero_force = -abs(state.vel * state.vel) * 0.7;
            }



            function sign(x) { return x < 0 ? -1 : 1; }

            let B = 1;

            /* SAE 950311 */
            state.rear_slip_ratio += (abs(state.vel) - (tire_outer_R / 1000) * state.rear_omega * sign(state.vel) - abs(state.vel) * state.rear_slip_ratio) / B * dt;

            state.front_slip_ratio += (abs(state.vel) - (tire_outer_R / 1000) * state.front_omega * sign(state.vel) - abs(state.vel) * state.front_slip_ratio) / B * dt;




            rear_force = sign(state.vel) * tire_long_force(-state.rear_slip_ratio, state.rear_normal);
            front_force = sign(state.vel) * tire_long_force(-state.front_slip_ratio, state.front_normal);






            let rear_moment = 0;
            rear_moment += rear_brake_clamp_force * rim_outer_R / 1000;
            rear_moment += -rear_force * tire_outer_R / 1000;
            rear_moment += -pedal_force * crank_length / gear_ratio / 1000;

            let front_moment = 0;
            front_moment += front_brake_clamp_force * rim_outer_R / 1000;
            front_moment += -front_force * tire_outer_R / 1000;

            state.rear_omega += rear_moment / wheelI * tt;
            state.rear_angle += state.rear_omega * tt;

            state.front_omega += front_moment / wheelI * tt;
            state.front_angle += state.front_omega * tt;


            let old_vel = state.vel;

            state.vel += (aero_force + front_force + rear_force - total_weight * sin(hill_angle)) / total_mass * tt;
            state.pos += state.vel * tt;


            let rear_normal = total_weight * (1 - cog[0] / wheelbase) + (rear_force + front_force) * (cog[1] + tire_outer_R) / wheelbase;
            let front_normal = total_weight * (cog[0] / wheelbase) - (rear_force + front_force) * (cog[1] + tire_outer_R) / wheelbase;

            let norm_e = 0.95;
            state.rear_normal = max(0, state.rear_normal * (1 - norm_e) + rear_normal * norm_e);
            state.front_normal = max(0, state.front_normal * (1 - norm_e) + front_normal * norm_e);

            if (sign(state.vel) != sign(old_vel)) {
              state.rear_slip_ratio = -state.rear_slip_ratio;
              state.front_slip_ratio = -state.front_slip_ratio;
            }
          }


          velocity = max(0, state.vel);

          if (state.vel < 0.001) {
            state.tend = t;
            state.vel = 0;
            state.rear_slip_ratio = 0;
            state.rear_omega = 0;
            state.front_slip_ratio = 0;
            state.front_omega = 0;

            state.rear_normal = total_weight * (1 - cog[0] / wheelbase);
            state.front_normal = total_weight * (cog[0] / wheelbase);
            rear_force = front_force = 0;
            rear_brake_clamp_force = front_brake_clamp_force = 0;
            self.set_paused(true);
          }



          {

            forces.push({
              color: mode.startsWith("bike_force_longitudinal") ? force2_color_css : force5_color_css,
              position: [rear[0], -tire_outer_R, 0],
              direction: [rear_force, 0, 0],
            });

            if (mode === "bike_force_brake_front2") {
              forces.push({
                color: force3_color_css,
                position: [front[0], -tire_outer_R, 0],
                direction: [front_force, 0, 0],
                neg_color: force2_color_css,

              });
            } else {
              forces.push({
                color: force5_color_css,
                position: [front[0], -tire_outer_R, 0],
                direction: [front_force, 0, 0],
              });
            }

            if (mode === "bike_force_brake_front" || mode === "bike_force_brake_front2") {
              let c = cos(0.3);
              let s = sin(0.3);
              forces.push({
                color: force4_color_css,
                position: [front[0] - 305 * s,
                  +305 * c, 0
                ],
                direction: [front_brake_clamp_force * c,
                  front_brake_clamp_force * s, 0
                ],

              });
            } else if (mode === "bike_force_brake_rear") {
              let c = cos(-0.3);
              let s = sin(-0.3);
              forces.push({
                color: force4_color_css,
                position: [rear[0] - 305 * s,
                  +305 * c, 0
                ],
                direction: [rear_brake_clamp_force * c,
                  rear_brake_clamp_force * s, 0
                ],

              });
            }

            if (mode === "bike_force_brake_front" ||
              mode === "bike_force_brake_front2" ||
              mode === "bike_force_brake_rear") {

              forces.push({
                color: force6_color_css,
                position: [1050, 420, 0],
                direction: [-slider_args[0] * 500 / 7.5, 0, 0],
              });
            }



            if (mode !== "bike_force_longitudinal" &&
              mode !== "bike_force_longitudinal2" &&
              mode !== "bike_force_pedal" &&
              mode !== "bike_force_brake_front2") {
              forces.push({
                color: force_color_css,
                position: [rear[0], -tire_outer_R, 0],
                direction: [0, state.rear_normal, 0],
              });

              forces.push({
                color: force2_color_css,
                position: [front[0], -tire_outer_R, 0],
                direction: [0, state.front_normal, 0],


              });
            } else {

              let p0 = [pedal_forces_x[0], pedal_forces_y[0], 0];
              let pp0 = feet_positions[0];

              let p1 = [pedal_forces_x[1], pedal_forces_y[1], 0];
              let pp1 = feet_positions[1];

              if (mode !== "bike_force_pedal") {
                forces.push({
                  color: force1_color_css,
                  position: cop,
                  direction: [aero_force, 0, 0],
                });
              }

              if (mode === "bike_force_longitudinal2") {



                forces.push({
                  color: force_color_css,
                  position: cog,
                  direction: [-total_weight * sin(hill_angle), 0, 0],
                  shift: true,
                });


              }

            }
          }

          x_pos = state.pos * 1000;

          rear_wheel_angle = state.rear_angle;
          front_wheel_angle = state.front_angle;
        } else if (mode === "bike_force_normal_rotation") {

          let start_pos = 431.85;

          let f0 = [0, total_weight * (1 - start_pos / wheelbase), 0];
          let f1 = [0, total_weight * (start_pos / wheelbase), 0];

          let mat = rot_z_mat3(-cog_rotation_angle);

          forces.push({
            color: force_color_css,
            position: mat3_mul_vec(mat, [rear[0], -tire_outer_R, 0]),
            direction: mat3_mul_vec(mat, f0),
            moment_center: cog
          });

          forces.push({
            color: force4_color_css,
            position: vec_add(mat3_mul_vec(mat, [front[0], -tire_outer_R, 0]), [0, -wheelbase * sin(-cog_rotation_angle), 0]),
            direction: mat3_mul_vec(mat, f1),
            moment_center: cog
          });

          forces.push({
            color: force1_color_css,
            position: cog,
            direction: mat3_mul_vec(mat, [0, -total_weight, 0]),
            shift: true,
          });
        } else if (mode === "bike_force_front_flip") {

          mvp_translation = -0.35;

          x_pos = state.tx * 1000;


          let t = slider_args[0] * 0.9;

          draw_scale = 0.8;

          let front_force = -smooth_step(0, 0.5, t) * 1500;
          front_force += smooth_step(0.5, 1.2, t) * 1500;

          let rear_normal = total_weight * (1 - cog[0] / wheelbase) + (front_force) * (cog[1] + tire_outer_R) / 1000;
          let front_normal = total_weight * (cog[0] / wheelbase) - (front_force) * (cog[1] + tire_outer_R) / 1000;


          if (t > 0.5) {
            rear_normal = 0;
            front_normal = 1851.278028839296 - 900 * smooth_step(0.5, 1.2, t);
          }

          let mat = rot_z_mat3(-cog_rotation_angle);



          if (state.ry > 0) {
            forces.push({
              color: force_color_css,
              position: mat3_mul_vec(mat, [rear[0], -tire_outer_R, 0]),
              direction: mat3_mul_vec(mat, [0, state.ry, 0]),
            });
          }


          let front_pos = [front[0] - sin(cog_rotation_angle) * tire_outer_R, -(cos(cog_rotation_angle)) * tire_outer_R, 0];

          forces.push({
            color: force2_color_css,
            position: front_pos,
            direction: mat3_mul_vec(mat, [0, state.fy, 0]),
          });

          forces.push({
            color: force5_color_css,
            position: front_pos,
            direction: mat3_mul_vec(mat, [state.fx, 0, 0]),
          });

        } else if (mode === "bike_force_pedal_press") {
          front_only = false;
          front_rot = -pi / 2;
          draws_cog = false;
          draw_scale = 2;
          mvp_translation = -0.1;


          forces.push({
            color: force_color_css,
            position: [feet_positions[0][0], feet_positions[0][1], 120],
            direction: [0, pedal_forces_y[0], 0],
          });

          forces.push({
            color: force_color_css,
            position: [feet_positions[1][0], feet_positions[1][1], -120],
            direction: [0, pedal_forces_y[1], 0],
          });
        } else if (mode === "bike_force_lateral" || mode === "bike_force_lateral2") {

          mvp_translation = -0.35;
          front_rot = pi / 2;
          front_only = false;

          if (state === undefined) {
            state = {};
            state.a = (Math.random() - 0.5) * 0.01;
            state.w = 0;
            state.cog_a = 0;
          }




          if (sim_slider && sim_slider.dragged) {

            state.a = (slider_args[0] - 0.5) * 2 * tilt_max;
            state.w = 0;
            state.dragged = true;

            self.set_paused(false);
          } else if (abs(state.a) != tilt_max) {

            if (state.dragged) {
              state.dragged = false;
              if (state.a == 0.0)
                state.a = (Math.random() - 0.5) * 0.01;
            }

            let cog_a = atan2(cog[2], cog[1]);

            let dw = g * 1000 * 1.5 / rr * sin(state.a)
            state.w += dw * dt;
            state.a += state.w * dt;

            state.a -= state.cog_a;
            state.cog_a = cog_a;
            state.a += state.cog_a;


            state.a = clamp(state.a, -tilt_max, tilt_max);

            let sl = state.a * 0.5 / tilt_max + 0.5;

            if (sim_slider) {


              sim_slider.set_value(sl);

              slider_args[0] = sl;
            }

          } else {
            self.set_paused(true);
          }

          forces.push({
            color: force_color_css,
            position: cog,
            direction: [0, -total_weight * cos(state.a), total_weight * sin(state.a)],
            forward: true,
          });

          let dda = g * 1000 * 0.75 / rr * sin(state.a);
          let rx = total_mass * (rr / 1000) * (state.w * state.w * sin(state.a) - dda * cos(state.a));
          let ry = total_mass * (g - (rr / 1000) * (state.w * state.w * cos(state.a) + dda * sin(state.a)));

          forces.push({
            color: force4_color_css,
            position: [0, -tire_outer_R, 0],
            direction: [0, ry * cos(-state.a), ry * sin(-state.a)],
          });

          forces.push({
            color: force1_color_css,
            position: [0, -tire_outer_R, 0],
            direction: [0, -rx * sin(state.a), -rx * cos(state.a)],
          });

          let fy = vec_scale([0, ry * cos(-state.a), ry * sin(-state.a)], s * 0.004);
          let fx = vec_scale([0, -rx * sin(state.a), -rx * cos(state.a)], s * 0.004);

          let b = [0, -tire_outer_R, 0];


          cog_tilt = state.a;


        } else if (mode.startsWith("bike_force_cornering") || mode === "hero" ||
          mode.startsWith("bike_force_handlebars") ||
          mode.startsWith("bike_force_stability")) {


          let iter = 32;

          let front_slip_angle;
          let rear_slip_angle;
          let front_lat_force_l;
          let rear_lat_force_l;

          dt /= iter;

          let sim_tilt = false;
          let fixed = true;

          if (mode === "bike_force_cornering" ||
            mode === "bike_force_cornering_intro" || mode === "hero") {
            fixed = false;
            if (state === undefined) {
              state = {};
              state.v = [v0, 0];
              state.pos = [0, 0];
              state.omega = 0;
              state.a = 0;

              state.ddtilt = 0;
              state.dtilt = 0;
              state.tilt = mode === "hero" ? 0 : -0.33463089;

            }
            if (mode === "hero")
              sim_tilt = true;

          } else if (mode === "bike_force_cornering2") {
            dt = 0.001;
            iter = 1 + slider_args[0] * base_duration / dt;

            state = {};
            state.v = [-3.81495061742279, 1.5020491958073396];
            state.pos = [0, 0];
            state.omega = 0.8375052883236502;
            state.a = 2.7088346944290045;

            state.ddtilt = 0;
            state.dtilt = 0;
            state.tilt = -0.33463089;

            sim_tilt = true;
          } else if (mode === "bike_force_cornering3" || mode === "bike_force_cornering4") {
            dt = 0.001;
            iter = 1 + slider_args[0] * base_duration / dt;

            state = {};
            state.v = [v0, 0];
            state.pos = [0, 0];
            state.omega = 0;
            state.a = 0;

            state.ddtilt = 0;
            state.dtilt = 0;
            state.tilt = 0;

            sim_tilt = true;
          } else if (mode.startsWith("bike_force_handlebars")) {
            dt = 0.001;
            iter = 1 + slider_args[0] * base_duration / dt;

            state = {};
            state.v = [v0, 0];
            state.pos = [0, 0];
            state.omega = 0;
            state.a = 0;

            state.ddtilt = 0;
            state.dtilt = 0;
            state.tilt = -0.01;

            sim_tilt = true;
          } else if (mode === "bike_force_cornering5") {
            dt = 0.001;
            iter = 1 + slider_args[0] * base_duration / dt;
            state = {};
            state.v = [3.947428469024474, 1.1080651975110016];
            state.pos = [0, 0];
            state.omega = 0.8357751843954281;
            state.a = 0.2159177019833045;

            state.ddtilt = 0;
            state.dtilt = 0;
            state.tilt = -0.32;
          } else if (mode.startsWith("bike_force_stability")) {
            dt = 0.001;
            iter = 1 + slider_args[0] * base_duration / dt;

            state = {};
            state.v = [v0, 0];
            state.pos = [0, 0];
            state.omega = 0;
            state.a = 0;

            state.ddtilt = 0;
            state.dtilt = 0;
            state.tilt = -0.01;

            sim_tilt = true;
          }



          let base_steer_angle = steer_angle;


          let to_front_l = [(front[0] - cog[0]) / 1000, 0, 0];
          let to_rear_l = [(rear[0] - cog[0]) / 1000, 0, 0];

          function vec_perp(x) { return [x[1], -x[0]]; }


          function tire_lat_force(slip_angle, fz) {
            let aa = 5 * pi / 180;
            slip_angle = clamp(slip_angle, -aa, aa);
            return sin(slip_angle * 0.5 * pi / aa) * fz;
          }

          let Iz = 2;
          let Ix = 12;

          let ccog = cog;

          let weight = total_weight;
          let mass = total_mass;
          let base_scale = 0.01;


          if (mode.startsWith("bike_force_stability")) {
            weight = bike_weight;
            mass = bike_mass;
            Iz = 1;
            Ix = 3;
            ccog = bike_cog;
            draws_cog = false;
            base_scale = 0.1;
          }


          let rry = (ccog[1] + tire_outer_R) / 1000;
          let rrx = (ccog[2]) / 1000;
          let rr = sqrt(rry * rry + rrx * rrx);

          let front_normal;
          let rear_normal;

          let rear_lat_force;
          let front_lat_force;

          for (let i = 0; i < iter; i++) {
            let v = state.v;
            let omega = state.omega;
            let a = state.a;
            let tilt = state.tilt;
            let ca = cos(a);
            let sa = sin(a);

            if (fixed)
              steer_angle = steer_angle_func(i * dt);


            let to_front = [ca * to_front_l[0], sa * to_front_l[0], 0];
            let to_rear = [ca * to_rear_l[0], sa * to_rear_l[0], 0];

            let front_v = vec_add(v, vec_scale(vec_perp(to_front), -omega));
            let rear_v = vec_add(v, vec_scale(vec_perp(to_rear), -omega));


            front_slip_angle = -atan2(front_v[1], front_v[0]) + steer_angle + a;
            rear_slip_angle = -atan2(rear_v[1], rear_v[0]) + a;

            front_slip_angle = (front_slip_angle + 7 * pi) % (2 * pi) - pi;
            rear_slip_angle = (rear_slip_angle + 7 * pi) % (2 * pi) - pi;

            let ry = weight;

            front_normal = ry * (ccog[0] / wheelbase);
            rear_normal = ry * (1 - ccog[0] / wheelbase);




            front_lat_force_l = tire_lat_force(front_slip_angle, front_normal);
            rear_lat_force_l = tire_lat_force(rear_slip_angle, rear_normal);

            let domega = (to_rear_l[0] * rear_lat_force_l +
              to_front_l[0] * front_lat_force_l * cos(steer_angle)) / Iz;



            let ddtilt = (rear_lat_force_l * cos(tilt) * rry +
              front_lat_force_l * cos(tilt) * rry * cos(steer_angle) +
              weight * sin(tilt) * rry) / Ix;


            rear_lat_force = [-sa * rear_lat_force_l, ca * rear_lat_force_l];
            front_lat_force = [-sin(a + steer_angle) * front_lat_force_l,
              cos(a + steer_angle) * front_lat_force_l
            ];

            let dv = vec_scale(vec_add(rear_lat_force, front_lat_force), 1 / mass);

            if (steer_angle != 0) {
              let sa;;
            }


            state.omega += domega * dt;
            state.a += state.omega * dt;

            state.a = (state.a + 2 * pi) % (2 * pi);

            state.v = vec_add(state.v, vec_scale(dv, dt));
            state.v = vec_scale(vec_norm(state.v), v0);
            state.pos = vec_add(state.pos, vec_scale(state.v, dt));

            if (sim_tilt) {
              state.ddtilt = ddtilt;
              state.dtilt += ddtilt * dt;
              state.tilt += state.dtilt * dt;
            }
            // 
          }

          cog_tilt = state.tilt;

          rry = ccog[1] + tire_outer_R;
          rrx = ccog[2];
          cog_translation = [ccog[0], rry, rrx];
          cog_translation = mat3_mul_vec(rot_x_mat3(cog_tilt), cog_translation);
          cog_translation = vec_sub(cog_translation, [0, tire_outer_R, 0]);

          let dda = state.ddtilt;
          let rx = mass * rr * (state.dtilt * state.dtilt * sin(state.tilt) - dda * cos(state.a));
          let ry = mass * (g - rr * (state.dtilt * state.dtilt * cos(state.tilt) + dda * sin(state.a)));

          if (mode === "bike_force_handlebars") {


            forces.push({
              color: force2_color_css,
              position: [0, -tire_outer_R, 0],
              direction: [0, ry * cos(-state.tilt), ry * sin(-state.tilt)],
            });


            forces.push({
              color: force_color_css,
              position: cog,
              direction: [0, -weight * cos(state.tilt), weight * sin(state.tilt)],
              forward: true,
            });


            let ff = vec_len(rear_lat_force) + vec_len(front_lat_force);
            forces.push({
              color: force6_color_css,
              position: [0, -tire_outer_R, 0],
              direction: [0, -ff * sin(state.tilt), -ff * cos(state.tilt)],
            });

          }

          if (!mode.startsWith("bike_force_stability")) {

            if (mode === "bike_force_cornering5") {

              base_scale = 0.03;
            } else {
              // if (mode !== "bike_force_cornering_intro") 
              {
                forces3d.push({
                  mat: mat4_mul(translation_mat4(cog_translation), mat4_mul(rot_x_mat4(-pi / 2), mat4_mul(scale_mat4(base_scale * weight), translation_mat4([0, 0, -50])))),
                  rot: rot_x_mat3(-pi / 2),
                  color: force_color,
                });
              }



              forces3d.push({
                mat: mat4_mul(translation_mat4([rear[0], -tire_outer_R, 0]), mat4_mul(rot_x_mat4(pi / 2), scale_mat4(base_scale * rear_normal))),
                rot: rot_x_mat3(pi / 2),
                color: force2_color,
              });


              forces3d.push({
                mat: mat4_mul(translation_mat4([front[0], -tire_outer_R, 0]), mat4_mul(rot_x_mat4(pi / 2), scale_mat4(base_scale * front_normal))),
                rot: rot_x_mat3(pi / 2),
                color: force2_color,
              });
            }

            forces3d.push({
              mat: mat4_mul(translation_mat4([rear[0], -tire_outer_R, 0]), mat4_mul(rot_x_mat4(0), scale_mat4(base_scale * rear_lat_force_l))),
              rot: ident_mat3,
              color: mode === "bike_force_cornering5" ? force2_color : force6_color,
            });

            forces3d.push({
              mat: mat4_mul(translation_mat4([front[0], -tire_outer_R, 0]), mat4_mul(rot_y_mat4(steer_angle), scale_mat4(base_scale * front_lat_force_l))),
              rot: rot_y_mat3(steer_angle),
              color: mode === "bike_force_cornering5" ? force2_color : force6_color,
            });

          } else if (mode === "bike_force_stability3") {

            let a = atan2(ry, rx);

            state.force_plane_angle = a;

            let f = sqrt(rx * rx + ry * ry);

            let ff = f * (ccog[0] / wheelbase);
            let fr = f * (1 - ccog[0] / wheelbase);

            forces3d.push({
              mat: mat4_mul(translation_mat4([rear[0], -tire_outer_R, 0]), mat4_mul(rot_x_mat4(a), scale_mat4(base_scale * fr))),
              rot: rot_x_mat3(pi / 2),
              color: force_color,
            });


            forces3d.push({
              mat: mat4_mul(translation_mat4([front[0], -tire_outer_R, 0]), mat4_mul(rot_x_mat4(a), scale_mat4(base_scale * ff))),
              rot: rot_x_mat3(pi / 2),
              color: force_color,
            });
          }

          if (mode === "bike_force_cornering_intro") {
            draws_cog = false;

            let s = max(0, sin(crank_angle * 2 - 0.5)) * 300;
            forces3d.push({
              mat: mat4_mul(translation_mat4([rear[0], -tire_outer_R, 0]), mat4_mul(rot_y_mat4(-pi / 2), scale_mat4(base_scale * s))),
              rot: rot_y_mat3(-pi / 2),
              color: force1_color,
            });

            let tt = vec_add(cog_translation, [-10, 80, 0]);
            forces3d.push({
              mat: mat4_mul(translation_mat4(tt), mat4_mul(rot_y_mat4(pi / 2), scale_mat4(base_scale * 100))),
              rot: rot_y_mat3(pi / 2),
              color: force1_color,
            });
          }

          front_only = false;



        }

        if (mode === "bike_force_handlebars") {
          front_rot = pi / 2;
          front_only = false;
          background_angle = -state.a;
        }
        if (mode === "hero") {
          draws_cog = false;
        }

        if (mode !== "bike_force_front_flip") {
          cog_translation = [0, rry, rrx];
          cog_translation = mat3_mul_vec(rot_x_mat3(cog_tilt), cog_translation);
          cog_translation = vec_sub(cog_translation, [0, rry, rrx]);
        }


        if (mode === "bike_force1" || mode === "bike_force2" ||
          mode === "bike_force3" || mode === "bike_force4" ||
          mode.startsWith("bike_force_wheels")) {


          let f0 = [0, total_weight * (1 - cog[0] / wheelbase), 0];
          let f1 = [0, total_weight * (cog[0] / wheelbase), 0];

          let p0 = [0, pedal_forces_y[0], 0];
          let pp0 = feet_positions[0];

          let p1 = [0, pedal_forces_y[1], 0];
          let pp1 = feet_positions[1];

          let h = [0, arm_force, 0];
          let ph = hand_positions[0];

          let s = [0, seat_force, 0];
          let ps = seat_position;


          if (mode === "bike_force3") {
            let k = 1;
            let c = 3;
            if (state === undefined) {
              state = {};
              state.pos = [61.2998061454679, 38.688064940376684];
              state.vel = [0, 0];
            }


            let f = [100 * (1 - cog[0] / wheelbase),
              100 * (cog[0] / wheelbase)
            ];

            for (let i = 0; i < 2; i++) {
              f[i] -= max(0, state.pos[i]) * k;
              f[i] -= max(0, state.vel[i]) * c;
            }



            dt *= 50;
            let a = vec_scale(f, 0.1);
            state.vel = vec_add(state.vel, vec_scale(a, dt));
            state.pos = vec_add(state.pos, vec_scale(state.vel, dt));

            forces.push({
              color: force_color_css,
              neg_color: force1_color_css,
              position: [rear[0], -tire_outer_R, 0],
              direction: [0, max(0, state.pos[0]) * k * 9.027, 0],

            });

            forces.push({
              color: force4_color_css,
              neg_color: force5_color_css,
              position: [front[0], -tire_outer_R, 0],
              direction: [0, max(0, state.pos[1]) * k * 9.027, 0],
            });
          } else if (mode !== "bike_force_wheels2") {
            forces.push({
              color: force_color_css,
              neg_color: force1_color_css,
              position: [rear[0], -tire_outer_R, 0],
              direction: f0,
              moment_center: mode === "bike_force2" ? cog : undefined,
            });

            forces.push({
              color: force4_color_css,
              neg_color: force5_color_css,
              position: [front[0], -tire_outer_R, 0],
              direction: f1,
              moment_center: mode === "bike_force2" ? cog : undefined,
            });
          }

          if (mode === "bike_force_wheels2") {

            forces.push({
              color: ["#ddd", "#666"],
              position: [rear[0], wheel_separation, 0],
              direction: f0,
            });

            forces.push({
              color: ["#666", "#222"],
              position: [front[0], wheel_separation, 0],
              direction: f1,
            });


            forces.push({
              color: force2_color_css,
              position: [rear[0], 0, 0],
              direction: vec_neg(f0),
            });


            forces.push({
              color: force6_color_css,
              position: [front[0], 0, 0],
              direction: vec_neg(f1),
            });


            forces.push({
              color: force_color_css,
              position: [rear[0], -tire_outer_R, 0],
              direction: (f0),
            });


            forces.push({
              color: force4_color_css,
              position: [front[0], -tire_outer_R, 0],
              direction: (f1),
            });



            forces.push({
              color: force1_color_css,
              position: [rear[0], -tire_outer_R - wheel_separation_down, 0],
              direction: vec_neg(f0),
            });


            forces.push({
              color: force5_color_css,
              position: [front[0], -tire_outer_R - wheel_separation_down, 0],
              direction: vec_neg(f1),
            });


          }

          if (!mode.startsWith("bike_force_wheels")) {

            forces.push({
              color: force2_color_css,
              neg_color: force3_color_css,
              position: pp0,
              direction: p0
            });

            forces.push({
              color: force2_color_css,
              neg_color: force3_color_css,
              position: pp1,
              direction: p1
            });

            forces.push({
              color: force2_color_css,
              neg_color: force3_color_css,
              position: ph,
              direction: h
            });

            forces.push({
              color: force2_color_css,
              neg_color: force3_color_css,
              position: ps,
              direction: s
            });

          }
        } else if (mode === "bike_force_pedal") {
          let p0 = [pedal_forces_x[0], pedal_forces_y[0], 0];
          let pp0 = feet_positions[0];

          let p1 = [pedal_forces_x[1], pedal_forces_y[1], 0];
          let pp1 = feet_positions[1];

          let m0 = pedal_forces_x[0] * cos(crank_angle) + pedal_forces_y[0] * sin(crank_angle);
          let m1 = -pedal_forces_x[1] * cos(crank_angle) - pedal_forces_y[1] * sin(crank_angle);

          let m = min(0, m0 + m1);
          let f = m * crank_length / gear_ratio / tire_outer_R;

          let scale = 4;

          forces.push({
            color: force_color_css,
            position: pp0,
            direction: vec_scale(p0, scale),
            moment_center: sprocket
          });

          forces.push({
            color: force1_color_css,
            position: pp1,
            direction: vec_scale(p1, scale),
            moment_center: sprocket
          });

          forces.push({
            color: force2_color_css,
            neg_color: force3_color_css,
            position: vec_add(rear, [0, -tire_outer_R, 0]),
            direction: [f * scale, 0, 0]
          });

          draws_cog = false;
        }

        if (mode === "bike_force_tangent") {
          rot = rot_z_mat3(pi / 2);
          vp = mat4_mul(proj, mat3_to_mat4(rot));
          vp = mat4_mul(vp, scale_mat4(1.5));
        }


        let mvp;

        if (args.has_two_axis) {
          mvp = translation_mat4([front[0] * -0.5, tire_outer_R, 0]);

          mvp = mat4_mul(rot_x_mat4(pi / 2), mvp);
          mvp = mat4_mul(translation_mat4([0, 0, -600]), mvp);


          if (mode.startsWith("bike_force_stability"))
            mvp = mat4_mul(scale_mat4(1.3), mvp);

          mvp = mat4_mul(vp, mvp);

        } else {
          mvp = translation_mat4(vec_scale(front, -0.5));
          mvp = mat4_mul(rot_y_mat4(front_rot), mvp);
          mvp = mat4_mul(scale_mat4(draw_scale), mvp);
          mvp = mat4_mul(ortho_proj, mvp);
          mvp = mat4_mul(translation_mat4([0, mvp_translation, 0]), mvp);
        }



        let base_mvp = mvp;

        // if (!args.has_arcball) {
        mvp = mat4_mul(mvp, translation_mat4(cog_translation));
        mvp = mat4_mul(mvp, translation_mat4(cog));
        mvp = mat4_mul(mvp, rot_z_mat4(cog_rotation_angle));
        mvp = mat4_mul(mvp, rot_x_mat4(cog_tilt));
        mvp = mat4_mul(mvp, translation_mat4(vec_neg(cog)));
        // }
        mvp = mat4_mul(rot_z_mat4(hill_angle), mvp);


        {
          let rr = rot_y_mat3(front_rot);


          if (args.has_two_axis) {
            rr = mat3_mul(rot, rot_x_mat3(pi / 2));
          }

          let base_rr = rr;

          rr = mat3_mul(rr, rot_z_mat3(cog_rotation_angle));
          rr = mat3_mul(rr, rot_x_mat3(cog_tilt));

          gl.begin(width, height);


          draw_bike(mvp, rr, {
            crank_angle: crank_angle,
            steer_angle: steer_angle,
            rear_wheel_angle: rear_wheel_angle,
            front_wheel_angle: front_wheel_angle,
            wheel_separation: wheel_separation,
            right_pedal_angle: pedal_angles[1],
            left_pedal_angle: pedal_angles[0],
            brake_angles: brake_angles,

          });

          if (mode === "bike_force_stability" || mode === "bike_force_stability3") {
            let rad = 3;
            let mm = translation_mat4([0, 1, 0]);
            mm = mat4_mul(scale_mat4([rad, 330, rad]), mm);
            mm = mat4_mul(rot_x_mat4(0.25), mm);
            mm = mat4_mul(rot_z_mat4(-1.45), mm);
            mm = mat4_mul(translation_mat4(seat), mm);
            mm = mat4_mul(translation_mat4([0, 20, 20]), mm);

            let r = mat3_mul(rr, rot_x_mat3(pi / 8));

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mm), r, {
              color: [1, 0, 0, 1],
            });

            mm = mat4_mul(z_flip_mat4, mm);

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mm), r, {
              color: [1, 0, 0, 1],
            });

            mm = translation_mat4([0, 1, 0]);
            mm = mat4_mul(scale_mat4([16, rad, 16]), mm);
            mm = mat4_mul(rot_x_mat4(pi / 2), mm);
            mm = mat4_mul(rot_y_mat4(0.3), mm);
            mm = mat4_mul(translation_mat4(front), mm);
            mm = mat4_mul(translation_mat4([-105, 547, 174]), mm);

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mm), r, {
              color: [1, 0, 0, 1],
            });

            mm = mat4_mul(z_flip_mat4, mm);

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mm), r, {
              color: [1, 0, 0, 1],
            });


            mm = translation_mat4([0, 1, 0]);
            mm = mat4_mul(scale_mat4([16, rad, 16]), mm);
            mm = mat4_mul(rot_z_mat4(0.25), mm);
            mm = mat4_mul(translation_mat4(seat), mm);
            mm = mat4_mul(translation_mat4([-5, 18, 0]), mm);

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mm), r, {
              color: [1, 0, 0, 1],
            });
          }


          let human_mat = bike_mat;
          rr = mat3_mul(rr, bike_rot)



          if (wheel_separation)
            human_mat = mat4_mul(translation_mat4([0, wheel_separation, 0]), human_mat);

          if (!mode.startsWith("bike_force_stability"))
            draw_human(mat4_mul(mvp, human_mat), rr, mats);


          if (mode === "bike_force_stability2") {

            let ll = 380;

            let rr = 10;

            let mat;
            let r;
            mat = scale_mat4([rr, 100, rr])
            mat = mat4_mul(rot_x_mat4(pi / 2), mat);
            mat = mat4_mul(translation_mat4(front), mat);
            r = rot_x_mat3(pi / 2);

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(base_rr, r), { color: force_color });


            mat = scale_mat4([rr, ll, rr])
            mat = mat4_mul(rot_z_mat4(pi / 2), mat);
            mat = mat4_mul(translation_mat4(front), mat);
            r = rot_z_mat3(pi / 2);

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(base_rr, r), { color: force2_color });


            mat = scale_mat4([rr, ll, rr])
            mat = mat4_mul(translation_mat4(front), mat);
            r = ident_mat3;

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(base_rr, r), { color: force1_color });


          }


          if (mode !== "bike_force_wheels2" && !args.has_two_axis) {
            let p = mat4_mul_vec3(base_mvp, [x_pos, -tire_outer_R, 0]);


            draw_background(p[0] * 0.5 + 0.5, p[1] * 0.5 + 0.5, front_only ? undefined : (front_rot + background_angle),
              1, front_only, hill_angle
            );
          }

          if (mode.startsWith("bike_force_cornering") || mode === "bike_force_tangent" ||
            mode === "bike_force_handlebars2" || mode === "hero" ||
            mode.startsWith("bike_force_stability")) {

            let force_mvp = base_mvp.slice();


            if (mode !== "hero") {
              for (let force of forces3d) {
                gl.draw_arrow(mat4_mul(force_mvp, force.mat), mat3_mul(base_rr, force.rot), force.color, 10);
              }
            }



            let s = 10000;

            let quad_mat = mat4_mul(scale_mat4(s), translation_mat4([0, -0.5, -0.5]));
            if (state && state.a)
              quad_mat = mat4_mul(rot_x_mat4(-state.a), quad_mat);
            quad_mat = mat4_mul(rot_z_mat4(pi / 2), quad_mat);
            quad_mat = mat4_mul(translation_mat4([wheelbase * 0.5, -tire_outer_R, 0]), quad_mat);

            let args = state && state.pos ? [-state.pos[0] * 1000 / s, -state.pos[1] * 1000 / s, 7.0, 0.2] : [0, 0, 7.0, 0.2];

            gl.draw_quad(mat4_mul(base_mvp, quad_mat), rot, [0.01, 0.01, 0.03, 0.1], "feather_disc",
              args);

          }

          if (mode === "bike_force_stability3") {

            let quad_mat = mat4_mul(scale_mat4([0, 1200, 2000]), translation_mat4([0, -0.5, -0.5]));

            quad_mat = mat4_mul(translation_mat4([0, -350, 0]), quad_mat);
            quad_mat = mat4_mul(rot_y_mat4(pi / 2), quad_mat);
            quad_mat = mat4_mul(rot_x_mat4(state.force_plane_angle + pi / 2), quad_mat);
            quad_mat = mat4_mul(translation_mat4([wheelbase * 0.5, -tire_outer_R, 0]), quad_mat);


            gl.draw_quad(mat4_mul(base_mvp, quad_mat), rot, vec_scale(force_color, 0.3), "plain");
          }
        }
        ctx.drawImage(gl.finish(), 0, 0, width, height);
        ctx.save();

        ctx.translate(width / 2, height / 2);

        let p0 = project(mat4_mul_vec3(mvp, [rear[0], -tire_outer_R - wheel_separation_down, 0]));

        let pp = project(mat4_mul_vec3(mvp, [front[0], 0, 0]));
        let p1 = project(mat4_mul_vec3(mvp, [front[0], -tire_outer_R - wheel_separation_down, 0]));

        let dscale = (p1[1] - pp[1]);

        if (mode === "bike_force_normal_rotation" || mode === "bike_force_front_flip" ||
          mode === "bike_force_wheels2") {

          let h = tire_outer_R;
          if (mode === "bike_force_wheels2")
            h += wheel_separation_down;

          let p = project(mat4_mul_vec3(base_mvp, [rear[0], -h, 0]));
          ctx.save();
          ctx.strokeStyle = "rgba(0,0,0,0.3)"
          ctx.strokeLine(-width, p[1], width, p[1]);
          ctx.restore();
        }

        if (mode === "bike_force_tangent") {


          function intersect(p, r, q, s) {
            let a = vec_sub(q, p);
            return (a[0] * s[1] - a[1] * s[0]) / (r[0] * s[1] - r[1] * s[0]);
          }




          let slip_angle = 0.3 * steer_angle;

          let d0 = [cos(slip_angle), sin(slip_angle)];
          let d1 = [cos(slip_angle - steer_angle), sin(slip_angle - steer_angle)];

          let t = intersect(p0, d0, p1, d1);
          let u = intersect(p1, d1, p0, d0);

          let pp = vec_add(p0, vec_scale(d0, t));

          let s = width * 0.2;

          ctx.lineWidth = s * 0.03;

          ctx.globalAlpha = 0.7;
          if (abs(u) < 1e5) {
            ctx.strokeStyle = force1_color_css[0];
            ctx.strokeEllipse(pp[0], pp[1], abs(t));
            ctx.strokeStyle = force2_color_css[0];
            ctx.strokeEllipse(pp[0], pp[1], abs(u));
          } else {
            ctx.strokeStyle = force1_color_css[0];
            ctx.strokeLine(p0[0], -height, p0[0], height);
            ctx.strokeStyle = force2_color_css[0];
            ctx.strokeLine(p0[0], -height, p0[0], height);
          }

          ctx.lineWidth = s * 0.02;
          ctx.globalAlpha = 1;

          for (let i = 0; i < 2; i++) {

            let p = [p0, p1][i]
            let color = [force1_color_css, force2_color_css][i];
            let fcolor = [force_color_css, force4_color_css][i];

            ctx.strokeStyle = color[1];

            ctx.save();
            ctx.translate(p[0], p[1]);
            ctx.rotate(-steer_angle * i);

            ctx.strokeLine(0, -1.4 * s, 0, s * 0.4);

            ctx.rotate(slip_angle);


            ctx.setLineDash([0.07 * s, 0.07 * s]);

            ctx.strokeLine(0, -1.4 * s, 0, s * 0.4);

            ctx.globalAlpha = 1;

            ctx.fillStyle = color[0];
            ctx.strokeStyle = color[1];


            ctx.setLineDash([]);
            ctx.arrow(0, 0, 0, -s, 0.1 * s, 0.25 * s, 0.3 * s);

            ctx.fill();
            ctx.stroke();

            ctx.restore();
          }

        }


        if (mode !== "bike_force_lateral" && !mode !== "bike_force_lateral2") {
          let dd = mode === "bike_force_brake_front" || mode === "bike_force_brake_rear" ? font_size : 0;
          ctx.feather(width * scale, (height - dd) * scale,
            canvas.height * 0.1, canvas.height * 0.1,
            canvas.height * 0.1, canvas.height * 0.1);
        }


        if ((mode !== "bike_force_cornering_intro" && mode.startsWith("bike_force_cornering")) ||
          mode.startsWith("bike_force_stability") ||
          mode === "bike_force_handlebars2" ||
          mode === "bike_force_tangent") {

          let s = height * 0.05;
          ctx.save();
          ctx.translate(width * 0.42, height * 0.4);
          ctx.lineWidth = s * 0.05;
          ctx.strokeStyle = "rgba(0,0,0,0.2)"
          ctx.setLineDash([s * 0.1, s * 0.1]);
          ctx.strokeLine(0, -s * 3, 0, 0);

          ctx.lineCap = "butt";
          ctx.strokeStyle = "#aaa"
          ctx.setLineDash([]);

          ctx.lineWidth = s * 0.12;
          ctx.beginPath();
          ctx.arc(0, 0, s * 2.8, pi * 1.5, pi * 1.5 - steer_angle, steer_angle > 0);

          ctx.stroke();

          ctx.lineWidth = s * 0.05;

          ctx.rotate(-steer_angle);
          ctx.strokeLine(0, -s * 3, 0, 0);

          ctx.lineCap = "round";
          ctx.strokeStyle = "#222"
          ctx.lineWidth = s * 0.1;
          ctx.strokeLine(0, -s, 0, s);

          ctx.fillStyle = "#777";
          ctx.fillEllipse(0, 0, s * 0.06);
          ctx.restore();


        }




        if (mode === "bike_force_longitudinal" || mode === "bike_force_longitudinal2") {
          let p = project(mat4_mul_vec3(mvp, cop));
          ctx.fillStyle = "#8EC9E3";
          ctx.strokeStyle = "#567A89";
          ctx.fillEllipse(p[0], p[1], s * 0.08);
          ctx.strokeEllipse(p[0], p[1], s * 0.08);
        }

        ctx.lineWidth = s * 0.02;

        let force_scale = 0.006;

        if (mode.startsWith("bike_force_wheels"))
          force_scale = 0.004;
        else if (mode == "bike_force_longitudinal")
          force_scale = 0.05;
        else if (mode === "bike_force_longitudinal2")
          force_scale = 0.05;
        else if (mode === "bike_force_front_flip")
          force_scale = 0.0025;
        else if (mode === "bike_force_lateral" || mode === "bike_force_handlebars")
          force_scale = 0.004;
        else if (mode === "bike_force_lateral2")
          force_scale = 0.0;



        if (mode === "bike_force_brake_front" || mode === "bike_force_brake_rear") {
          force_scale = 0.005;

          if (state.tstart !== -1) {
            let tend = state.tend != -1 ? state.tend : t;

            ctx.font = ceil(width * 0.04) + "px IBM Plex Sans";

            let str = "brake time: " + (tend - state.tstart).toFixed(2) + " s";

            ctx.fillStyle = "#333";
            ctx.fillText(str, 0, height / 2 - font_size * 0.5);
          }
        }

        {
          ctx.save();

          for (let line of lines) {
            let p0 = project(mat4_mul_vec3(mvp, line.p0));
            let p1 = project(mat4_mul_vec3(mvp, line.p1));
            ctx.setLineDash(line.dash || []);
            ctx.lineWidth = width * 0.002 * line.width;
            ctx.strokeStyle = line.style || "rgba(0,0,0,0.3)";
            ctx.strokeLine(p0[0], p0[1], p1[0], p1[1]);
          }

          ctx.restore();
        }


        if (mode === "bike_force_longitudinal2") {

          draw_cog(s * 0.12, project(mat4_mul_vec3(mvp, vec_add(cog, [0, wheel_separation, 0]))), "#000000");
        }

        for (let force of forces) {

          let l = s * force_scale * (force.shift ? -1 : 1);

          if (l == 0)
            continue;

          let a = force.position;
          let b = vec_sub(force.position, vec_scale(force.direction, l));

          if (force.forward) {
            b = a;
            a = vec_add(force.position, vec_scale(force.direction, l));
          }

          let p0 = project(mat4_mul_vec3(mvp, a));
          let p1 = project(mat4_mul_vec3(mvp, b));


          if (force.shift) {
            let tmp = p1;
            p1 = p0;
            p0 = tmp;
          }

          ctx.fillStyle = force.color[0];
          ctx.strokeStyle = force.color[1];

          let len = vec_len(vec_sub(p1, p0));
          let scale = sharp_step(0, 30, len);

          if (force.moment_center) {
            let pc = project(mat4_mul_vec3(mvp, force.moment_center));

            let d = vec_sub(pc, p1);
            let dir = vec_norm(vec_sub(p0, p1));
            d = vec_sub(d, vec_scale(dir, vec_dot(d, dir)));
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.lineTo(p0[0], p0[1]);
            ctx.lineTo(p1[0], p1[1]);
            ctx.lineTo(p1[0] + d[0], p1[1] + d[1]);
            ctx.lineTo(p0[0] + d[0], p0[1] + d[1]);
            ctx.fill();
            ctx.globalAlpha = 1;
          }

          ctx.arrow(p1[0], p1[1], p0[0], p0[1], 0.1 * s * scale, 0.25 * s * scale, 0.3 * s * scale);
          ctx.fill();
          ctx.stroke();

          if (force.neg_color) {

            ctx.fillStyle = force.neg_color[0];
            ctx.strokeStyle = force.neg_color[1];

            p1 = vec_add(p0, vec_sub(p0, p1));
            ctx.arrow(p1[0], p1[1], p0[0], p0[1], 0.1 * s * scale, 0.25 * s * scale, 0.3 * s * scale);
            ctx.fill();
            ctx.stroke();
          }

        }






        if (draws_cog) {

          if (!mode.startsWith("bike_force_wheels") &&
            mode !== "bike_force_brake_rear" &&
            mode !== "bike_force_brake_front" &&
            mode !== "bike_force_front_flip" &&
            mode !== "bike_force_normal_rotation" &&
            mode !== "bike_force_tangent" &&
            mode !== "bike_force_lateral" &&
            mode !== "bike_force_lateral2" &&
            mode !== "bike_force_handlebars" &&
            mode !== "bike_force_handlebars2" &&
            !mode.startsWith("bike_force_cornering") &&
            mode !== "bike_force_longitudinal") {
            draw_cog(s * 0.12, project(mat4_mul_vec3(mvp, bike_cog)), "#619CBF");
            draw_cog(s * 0.12, project(mat4_mul_vec3(mvp, human_cog)), "#EBBC38");
          }

          draw_cog(s * 0.12, project(mat4_mul_vec3(mvp, vec_add(cog, [0, wheel_separation, 0]))), "#000000");
        }

        if (mode === "bike_force3") {
          ctx.save();
          ctx.globalCompositeOperation = "destination-out";
          ctx.fillStyle = "rgba(0,0,0,0.4)";
          ctx.fillRect(-width, -width, 2 * width, 2 * width);
          ctx.restore();
        }

        if (mode === "bike_force_normal_rotation" || mode === "bike_force2" ||
          mode === "bike_force_lateral" || mode === "bike_force_lateral2") {
          let p = project(mat4_mul_vec3(mvp, cog));


          ctx.save();
          ctx.strokeStyle = "rgba(0,0,0,0.3)";
          ctx.setLineDash([width * 0.01, width * 0.013]);
          ctx.strokeLine(p[0], p[1], p[0], height);
          ctx.restore();
        }




        if (mode === "bike_force3") {


          let rr = width * 0.14;
          let scale = 50;

          let pps = [
            [-width / 2 + rr + 3, -height * 0.35 + rr + 5],
            [+width / 2 - rr - 3, -height * 0.35 + rr + 5]
          ];

          for (let i = 0; i < 2; i++) {


            let x_offset = rear_wheel_angle * 1000 + i * 100;

            ctx.save();
            ctx.globalCompositeOperation = "destination-over";
            ctx.translate(pps[i][0], pps[i][1]);
            ctx.fillStyle = "#f8f8f8";
            ctx.fillRect(-rr, -rr, rr * 2, rr * 2);

            ctx.globalCompositeOperation = "destination-out";

            ctx.fillEllipse(0, 0, rr);

            ctx.globalCompositeOperation = "destination-over";

            ctx.beginPath();
            ctx.rect(-rr, -rr, rr * 2, rr * 2);
            ctx.clip();

            ctx.save();

            let kk = ceil(x_offset / (rr * 2));

            ctx.translate(-(x_offset % (rr * 2)), 0);

            ctx.translate(0, (state.pos[i] - 50) * width * 0.003);

            ctx.lineWidth = 2;
            ctx.fillStyle = "#222";
            ctx.strokeStyle = "#111";

            ctx.beginPath();
            ctx.lineTo(-rr, -rr * 2);
            ctx.lineTo(-rr, 0);

            let n = 30;

            for (let k = 0; k < n; k++) {
              let h = height * 0.005 * hash(kk * n * 0.5 + k + 4.5 + i * 0.2);
              h += -height * 0.005 + height * 0.002 * hash(kk * n * 0.5 + k + i * 0.2);

              ctx.lineTo(-rr + 4 * rr * k / n, h);
            }

            ctx.lineTo(rr * 3, 0);
            ctx.lineTo(rr * 3, -rr * 2);

            ctx.stroke();
            ctx.fill();

            ctx.fillStyle = "#878B8F";
            ctx.strokeStyle = "#333";

            ctx.beginPath();
            ctx.lineTo(-rr, rr * 2);
            ctx.lineTo(-rr, 0);


            for (let k = 0; k < n; k++) {
              let h = height * 0.005 * hash(kk * n * 0.5 + k + 4.5 + i * 0.2);

              ctx.lineTo(-rr + 4 * rr * k / n, h);
            }

            ctx.lineTo(rr * 3, 0);
            ctx.lineTo(rr * 3, rr * 2);

            ctx.stroke();
            ctx.fill();


            ctx.restore();


            ctx.restore()
          }

          draw_zoom(rr, rr / scale, pps[0], p0.slice(0, 2));
          draw_zoom(rr, rr / scale, pps[1], p1.slice(0, 2));
        } else if (mode === "bike_force_lateral" || mode === "bike_force_lateral2") {

          ctx.globalAlpha = smooth_step(0.8 * tilt_max, 1.15 * tilt_max, abs(state.a));
          ctx.fillStyle = "red";
          ctx.fillRect(-width, -height, 2 * width, 2 * height);

          ctx.feather(width * scale, height * scale,
            canvas.height * 0.1, canvas.height * 0.1,
            canvas.height * 0.1, canvas.height * 0.1);
        }


        ctx.restore();



        if (velocity !== undefined) {

          velocity *= metric ? 3.6 : 2.23694;

          let s = width * 0.035;
          let radius = s * 0.7;

          ctx.translate(s, s);
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,1)";
          ctx.shadowBlur = 3 * s;
          ctx.shadowOffsetY = s;
          ctx.fillRect(radius, radius, 7 * s - 2 * radius, 5 * s - 2 * radius);

          ctx.restore();

          ctx.fillStyle = "#393A3F";
          ctx.strokeStyle = "#222";
          ctx.roundRect(0, 0, 7 * s, 5 * s, radius);
          ctx.fill();
          ctx.stroke();

          let inset = s * 0.45;
          ctx.fillStyle = "#9FB19E";
          ctx.roundRect(inset, inset, 7 * s - 2 * inset, 5 * s - 2 * inset, radius - inset);
          ctx.fill();
          ctx.stroke();

          function draw_line(a, b, w, alpha) {
            let dir = vec_norm(vec_sub(b, a));
            let perp = [-dir[1], dir[0]];

            ctx.beginPath()
            ctx.lineTo(a[0], a[1]);
            ctx.lineTo(a[0] + dir[0] * w + perp[0] * w,
              a[1] + dir[1] * w + perp[1] * w);
            ctx.lineTo(b[0] - dir[0] * w + perp[0] * w,
              b[1] - dir[1] * w + perp[1] * w);
            ctx.lineTo(b[0], b[1]);
            ctx.lineTo(b[0] - dir[0] * w - perp[0] * w,
              b[1] - dir[1] * w - perp[1] * w);
            ctx.lineTo(a[0] + dir[0] * w - perp[0] * w,
              a[1] + dir[1] * w - perp[1] * w);
            ctx.closePath();
            ctx.globalAlpha = alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.stroke();
          }

          function draw_digit(d) {
            let lut = [0x5f, 0xc, 0x75, 0x7c, 0x2e, 0x7a, 0x7b, 0x4c, 0x7f, 0x7e, 0x0]
            let mask = lut[d];
            let hh = 1.5;
            let points = [
              [0, 0],
              [0, hh],
              [0, 2 * hh],
              [1, 0],
              [1, hh],
              [1, 2 * hh]
            ];
            let connections = [
              [0, 1],
              [1, 2],
              [4, 5],
              [3, 4],
              [0, 3],
              [1, 4],
              [2, 5]
            ];

            for (let i = 0; i < 7; i++) {

              let alpha = (mask & (1 << i)) == 0 ? 0.1 : 1.0;
              draw_line(points[connections[i][0]], points[connections[i][1]], 0.2, alpha);
            }

          }
          ctx.fillStyle = "#3C3D3C";
          ctx.strokeStyle = "#9FB19E";


          ctx.save();
          let sc = s;
          ctx.translate(sc * 1, sc * 4);
          ctx.scale(sc, -sc);
          ctx.transform(1, 0, 0.1, 1, 0, 0);
          ctx.concat
          ctx.lineWidth = s * 0.05 / sc;

          draw_digit(velocity < 10 ? 10 : floor(velocity / 10));
          ctx.translate(sc * 1.7 / sc, 0);
          draw_digit(floor(velocity % 10));

          ctx.translate(s * 1.9 / sc, s * 0.6 / sc);
          ctx.scale(0.8, 0.8);
          draw_digit(floor((velocity * 10) % 10));
          ctx.restore();

          ctx.font = "500 " + ceil(s * 0.6) + "px IBM Plex Sans";
          ctx.fillText(metric ? "km/h" : "MPH", s * 5, s * 4.2);
          ctx.fillEllipse(s * 4.3, s * 3.4, s * 0.15);
        }


      } else if (mode.startsWith("tire_force")) {

        let stick = true;
        let rate = 1.0;

        if (mode === "tire_force3") {
          rate = 1.2;
        } else if (mode === "tire_force4") {
          rate = 0.8;
        }


        let a0 = (slider_args[0] - 0.5) * 0.5;
        let a1 = a0 * rate;


        let fi = 0.13;
        let r1 = tire_outer_R
        let re = r1 * cos(fi);
        let r0 = rim_outer_R - 0.5;




        let x = a0 * re;

        gl.begin(width, height);

        let mvp = rot_y_mat4(pi / 2);
        mvp = mat4_mul(translation_mat4([x, tire_outer_R, 0]), mvp);
        mvp = mat4_mul(scale_mat4(8), mvp);
        mvp = mat4_mul(ortho_proj, mvp);
        mvp = mat4_mul(translation_mat4([0, -0.5, 0]), mvp);


        let pp = project(mat4_mul_vec3(mvp, [0, 0, 0]));
        let p1 = project(mat4_mul_vec3(mvp, [0, tire_outer_R, 0]));

        let dscale = abs(p1[1] - pp[1]);

        mvp = mat4_mul(mvp, rot_x_mat4(a1));

        draw_wheel(mvp, rot, false, true);

        ctx.drawImage(gl.finish(), 0, 0, width, height);

        ctx.globalCompositeOperation = "destination-over";

        let grd = ctx.createLinearGradient(0, 0, 0, height);
        grd.addColorStop(0.0, "#D1E8F5");
        grd.addColorStop(0.9, "#fbfbfb");
        ctx.fillStyle = grd;


        ctx.fillRect(0, 0, width * 2, height * 2);
        ctx.globalCompositeOperation = "source-over";

        let s = dscale / tire_outer_R;

        ctx.translate(width / 2, height / 2);
        ctx.translate(pp[0], pp[1]);

        ctx.scale(s, s);

        ctx.lineWidth = 1.5 / s;

        draw_ground(x, re, width, height);


        {

          ctx.lineWidth = 1;

          ctx.strokeStyle = "#666";
          ctx.fillStyle = "#666";

          let n = 50;

          let rg = re;

          for (let i = 0; i < n; i++) {
            let a = a1 + i * 0.02 + 1;

            let ca = cos(a);
            let sa = sin(a);

            let p0 = [r0 * ca, r0 * sa];

            let ss = 1 - max(r1 * sa - rg, 0) / (r1 * sa);
            if (sa == 0)
              ss = 1
            let p1org = [r1 * ca * ss, r1 * sa * ss];


            if (stick) {

              let t = (a - pi / 2 + fi) / fi / 2;

              let orga = a;
              a = (a - pi / 2 + fi) / rate;
              a += +pi / 2 - fi;

              t = smooth_step(-0.1, 0.0, t) - smooth_step(0.7, 1.2, t);

              a = lerp(orga, a, t);

              ca = cos(a);
              sa = sin(a);

            }


            ss = 1 - max(r1 * sa - rg, 0) / (r1 * sa);
            if (sa == 0)
              ss = 1


            let p1 = [r1 * ca * ss, r1 * sa * ss];

            if (stick) {
              ctx.setLineDash([0.5, 1.5]);
              ctx.lineWidth = 0.5;
              ctx.strokeLine(p0[0], p0[1], p1org[0], p1org[1]);
              ctx.setLineDash([]);
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(p0[0], p0[1]);
              ctx.quadraticCurveTo(p1org[0] * 0.99, p1org[1] * 0.99, p1[0], p1[1]);
              ctx.stroke();
            } else {
              ctx.strokeLine(p0[0], p0[1], p1[0], p1[1]);
            }

            ctx.fillStyle = force_color_css[1];
            ctx.fillEllipse(p1[0], p1[1], 1.7);
            ctx.fillStyle = force_color_css[0];
            ctx.fillEllipse(p1[0], p1[1], 1.3);

            ctx.fillStyle = force1_color_css[1];
            ctx.fillEllipse(p0[0], p0[1], 1.7);
            ctx.fillStyle = force1_color_css[0];
            ctx.fillEllipse(p0[0], p0[1], 1.3);
          }

        }



        ctx.feather(width * scale, height * scale,
          canvas.height * 0.2, canvas.height * 0.2,
          canvas.height * 0.2, canvas.height * 0.2);


      } else if (mode.startsWith("wheel_velocity")) {


        if (state === undefined) {
          state = {};
          state.a = -0.2;
          state.x = 0;
          state.segments = [];
          state.segment_index = -1;
        }


        let fi = 0.13;
        let r1 = tire_outer_R;
        let re = r1 * cos(fi);

        let sc = 3e4;
        let v = slider_args[0] * dt * sc;
        let w = slider_args[1] * dt * sc / re;

        let slip = (slider_args[1] - slider_args[0]) / (slider_args[0]);

        if (isNaN(slip))
          slip = 0;

        state.x += v * dt;
        state.a += w * dt;

        let ln = 20;
        let rr = width * 0.298;
        let l = rr * 2 * pi / ln;



        gl.begin(width, height);

        let mvp = rot_y_mat4(pi / 2);
        mvp = mat4_mul(scale_mat4(1.8), mvp);
        mvp = mat4_mul(ortho_proj, mvp);

        let base_mvp = mvp;

        let pp = project(mat4_mul_vec3(mvp, [0, 0, 0]));
        let p1 = project(mat4_mul_vec3(mvp, [0, re, 0]));

        let dscale = abs(p1[1] - pp[1]);


        mvp = mat4_mul(mvp, rot_x_mat4(state.a));


        draw_wheel(mvp, rot, false, true);


        {
          let p = mat4_mul_vec3(base_mvp, [2 * state.x, -re, 0]);

          draw_background(p[2] * 0.5 + 0.5, (p[1] * 0.5 + 0.5));
        }





        ctx.drawImage(gl.finish(), 0, 0, width, height);

        ctx.translate(width / 2, height / 2);

        {
          let segment_index = floor(((state.a / (2 * pi)) % 1) * ln);

          if (segment_index != state.segment_index) {
            state.segments.push(state.x);
            state.segment_index = segment_index;
          }

          let i = state.segments.findIndex((el, i) => { return (i & 1) == 1 && el < state.x - 500 });
          if (i > 0)
            state.segments = state.segments.slice(i + 1);


          if (state.segments.length > 512)
            state.segments = state.segments.slice(state.segments.length - 32);


          ctx.lineCap = "round";

          ctx.strokeStyle = "#DDDDDD";
          ctx.lineWidth = width * 0.009;

          for (let i = 0; i < state.segments.length; i += 2) {

            let dd = 3;
            let x0 = state.segments[i];
            let p0 = project(mat4_mul_vec3(base_mvp, [0, -re, -(state.x - x0 + dd)]));
            1
            let x1 = (i + 1) < state.segments.length ? state.segments[i + 1] : state.x;
            let p1 = project(mat4_mul_vec3(base_mvp, [0, -re, -(state.x - x1 - dd)]));

            ctx.strokeLine(p0[0], p0[1] + width * 0.003, p1[0], p1[1] + width * 0.003);
          }

          ctx.globalAlpha = 1.0;
          ctx.lineWidth = width * 0.009;

          {
            ctx.save();
            ctx.rotate(state.a);

            for (let i = 0; i < ln; i++) {

              ctx.beginPath();

              let a0 = i * 2 * 2 * pi / ln;
              let a1 = (i + 0.5) * 2 * 2 * pi / ln;

              for (let k = 0; k < 10; k++) {
                let a = lerp(a0, a1, k / 9);
                ctx.lineTo(cos(a) * (rr - width * 0.002), sin(a) * (rr - width * 0.002));
              }

              ctx.stroke();
            }


            ctx.restore();
          }

        }


        ctx.lineWidth = width * 0.004;


        {
          ctx.save();
          ctx.rotate(state.a);
          ctx.scale(-1, 1);

          ctx.fillStyle = force1_color_css[0];
          ctx.strokeStyle = force1_color_css[1];

          let a = sharp_step(0.1, 1.0, slider_args[1]);
          let r = width * 0.2;
          let w = width * 0.03;
          let s = sharp_step(0, 0.1, slider_args[1]);

          ctx.beginPath();
          ctx.arc(0, 0, r + w * s / 2, Math.PI * (0.5 + a), Math.PI * 0.5, true);
          ctx.lineTo(0, r + 1.2 * w * s);
          ctx.lineTo(2 * w * s * 1.2, r);
          ctx.lineTo(0, r - 1.2 * w * s);
          ctx.arc(0, 0, r - w * s / 2, Math.PI * 0.5, Math.PI * (0.5 + a));
          ctx.closePath();

          ctx.fill();
          ctx.stroke();

          ctx.restore();
        }

        {


          ctx.fillStyle = force6_color_css[0];
          ctx.strokeStyle = force6_color_css[1];

          let s = width * 0.3;
          let l = slider_args[0];
          let as = s * sharp_step(0, 0.3, l);

          ctx.arrow(0, 0, l * s, 0, 0.1 * as, 0.25 * as, 0.3 * as);

          ctx.fill();
          ctx.stroke();
        }


        ctx.feather(width * scale, (height - (mode === "wheel_velocity2" ? font_size : 0)) * scale,
          canvas.height * 0.2, canvas.height * 0.2,
          canvas.height * 0.2, canvas.height * 0.2);


        if (mode === "wheel_velocity2") {
          let text = `slip ratio = ${slip < 0 ? "−" : ""}${!isFinite(slip) ? `infinite` : abs(slip).toFixed(2)}`

          ctx.translate(0, height / 2 - font_size);
          ctx.fillStyle = "#333";
          ctx.fillText(text, 0, 0);
        }



      } else if (mode === "torsion1" || mode === "torsion2" ||
        mode === "torsion3" || mode === "torsion4") {


        let t = slider_args[0];

        let ro = 0.03;
        let ri = 0.0;
        let l = 0.5;
        let torque = t * 3e5;

        if (mode === "torsion3") {

          ro = 0.03;
          let x = pow(slider_args[1], 1 / 3) * 0.9;
          let A = pi * ro * ro;
          ro = sqrt(A / (pi * (1 - x * x)));
          ri = ro * x;
        } else if (mode === "torsion4") {
          l = 0.05;
          ro = 0.08;
          torque = t * 3e7;
        }


        let G = 80e9;
        let J = pi * (ro * ro * ro * ro - ri * ri * ri * ri) * 0.5;


        let sigma = torque * ro / J;
        let twist = torque * l / (G * J);

        let sigma_scale = 2e8;

        let stress_scale;

        if (mode !== "torsion1") {
          stress_scale = sigma / sigma_scale;
        }

        gl.begin(width, height);

        let fov = pi * 0.07;
        let near = 1.0;
        let far = 17.0;

        let f = 1 / Math.tan(fov / 2);
        let rangeInv = 1 / (near - far);

        let proj = [
          f / aspect, 0, 0, 0,
          0, f, 0, 0,
          0, 0, (near + far) * rangeInv, -1,
          0, 0, near * far * rangeInv * 2, 0
        ];

        proj = mat4_transpose(proj);
        proj = mat4_mul(proj, translation_mat4([0, 0, -6.5]));
        proj = mat4_mul(proj, scale_mat4(0.001));


        let vp = mat4_mul(proj, mat3_to_mat4(rot));
        let mvp = scale_mat4(5000);
        mvp = mat4_mul(vp, mvp);

        let mat = rot_y_mat4(t * 5);
        mat = mat4_mul(rot_z_mat4(-pi / 2), mat);
        mat = mat4_mul(scale_mat4(0.002 * t), mat);
        mat = mat4_mul(translation_mat4([-l / 2 - 0.05, 0, 0]), mat);

        let r = rot_y_mat3(t * 5);
        r = mat3_mul(rot_z_mat3(-pi / 2), r);

        gl.draw_mesh("Moment_arrow", mat4_mul(mvp, mat), mat3_mul(rot, r));

        mat = rot_y_mat4(t * 5);
        mat = mat4_mul(rot_z_mat4(pi / 2), mat);
        mat = mat4_mul(scale_mat4(0.002 * t), mat);
        mat = mat4_mul(translation_mat4([l / 2 + 0.05, 0, 0]), mat);

        r = rot_y_mat3(t * 5);
        r = mat3_mul(rot_z_mat3(pi / 2), r);

        gl.draw_mesh("Moment_arrow", mat4_mul(mvp, mat), mat3_mul(rot, r));

        if (mode === "torsion4") {
          let rro = ro;
          ro *= 0.08 + 0.92 * slider_args[1];
          ri = ro - 0.005;

          gl.draw_rod(mvp, rot, [ri * 2, ro, l, twist], [0.8, 0.8, 0.8, 1], undefined, true);

          gl.draw_rod(mvp, rot, [0, rro + 0.001, l + 0.001, twist], [0, 0, 0, 0.08], undefined, true);

        } else {
          gl.draw_rod(mvp, rot, [ri * 2, ro, l, twist], [0.8, 0.8, 0.8, 1], stress_scale, true);
        }


        ctx.drawImage(gl.finish(), 0, 0, width, height);

        ctx.feather(width * scale, height * scale,
          0, 0,
          canvas.height * 0.15, canvas.height * 0.15);


      } else if (mode === "bending1" || mode === "bending2" ||
        mode === "bending3" || mode === "bending4" ||
        mode === "bending5" || mode === "bending6" ||
        mode === "bending_moment") {

        let b = 0.05;
        let h = 0.05;
        let l = 1.0;

        let ro = 0.03;
        let ri = 0.02;

        let t = slider_args[0];

        let M = 3e4 * t;

        let color = [0.8, 0.8, 0.8, 1];

        let stress = false;
        let rod = false;
        let sigma_scale = 72e8;

        if (mode === "bending3") {
          let A = b * h;

          if (slider_args[1] < 0.5) {
            b = lerp(0.02, 0.05, sharp_step(0.0, 0.5, slider_args[1]));
            h = A / b;
          } else {
            h = lerp(0.05, 0.02, sharp_step(0.5, 1.0, slider_args[1]));
            b = A / h;
          }

          stress = true;
        } else if (mode === "bending4") {
          stress = true;
        } else if (mode === "bending5") {
          ri = 0;
          ro = 0.02 + 0.03 * slider_args[1];
          stress = true;
          rod = true;

          sigma_scale = 10e7;
          h = ro;
        } else if (mode === "bending6") {

          ro = 0.02;
          let x = pow(slider_args[1], 1 / 3) * 0.98;
          let A = pi * ro * ro;
          ro = sqrt(A / (pi * (1 - x * x)));
          ri = ro * x;
          stress = true;
          rod = true;

          sigma_scale = 10e7;
          h = ro;
        } else if (mode === "bending_moment") {
          l = 0.1;
          M = 5e5;
          t = 0.3;

        }

        let E = 200e9;

        if (mode === "bending1") {
          if (slider_args[1] == 1) {
            E = 114e9;
            color = hex_to_color("#C1C2BA");
          } else if (slider_args[1] == 2) {
            E = 70e9;
            color = hex_to_color("#D4D5D4");

          }
        }
        let I = b * h * h * h / 12;

        if (rod) {
          I = pi * (ro * ro * ro * ro - ri * ri * ri * ri) * 0.25;
        }

        let sigma = M * h / I;

        let rho = E * I / (M + 1000);

        let cap; {
          let fi = (0.5 * l + 0.02) / rho;

          let c = cos(fi);
          let s = sin(fi);
          let r = rho;

          let x = r * s;
          let y = r * c - rho;

          cap = [x, 0, y];
        }


        let mvp = translation_mat4([0, 0, 0]);

        if (mode === "bending2" || mode === "bending_moment") {
          rot = rot_x_mat3(pi / 2);
          mvp = mat4_mul(scale_mat4(mode === "bending_moment" ? 7000 : 1500), mvp)
          mvp = mat4_mul(mat3_to_mat4(rot), mvp);
          mvp = mat4_mul(ortho_proj, mvp);
          mvp = mat4_mul(translation_mat4([0, mode === "bending_moment" ? -0.1 : 0.2, 0]), mvp);
        } else {

          let fov = pi * 0.07;
          let near = 1.0;
          let far = 17.0;

          let f = 1 / Math.tan(fov / 2);
          let rangeInv = 1 / (near - far);

          proj = [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
          ];


          proj = mat4_transpose(proj);
          proj = mat4_mul(proj, translation_mat4([0, 0, -6.5]));
          proj = mat4_mul(proj, scale_mat4(0.001));

          let vp = mat4_mul(proj, mat3_to_mat4(rot));

          mvp = mat4_mul(translation_mat4([0, 0, -cap[2] / 2]), mvp);
          mvp = mat4_mul(scale_mat4(mode === "bending3" ? 2500 : 2500), mvp)
          mvp = mat4_mul(vp, mvp);


        }

        gl.begin(width, height);

        let mat = rot_y_mat4(-0.5 + t * 2);
        mat = mat4_mul(translation_mat4([30, 0, 0]), mat);
        mat = mat4_mul(scale_mat4(0.002 * t), mat);

        mat = mat4_mul(translation_mat4(cap), mat);

        let r = rot_y_mat3(t * 2);

        gl.draw_mesh("Moment_arrow", mat4_mul(mvp, mat), mat3_mul(rot, r));


        mat = mat4_mul(x_flip_mat4, mat);
        gl.draw_mesh("Moment_arrow", mat4_mul(mvp, mat), mat3_mul(rot, r));


        if (mode === "bending5" || mode === "bending6") {
          gl.draw_rod(mvp, rot, [ri * 2, ro, l, rho], color, sigma / sigma_scale);
        } else {
          gl.draw_beam(mvp, rot, [b / 2, h / 2, l, rho], color, stress ? sigma / sigma_scale : undefined);
        }

        ctx.drawImage(gl.finish(), 0, mode === "bending2" ? -height * 0.1 : 0, width, height);




        if (mode === "bending2") {

          let s = width * 0.75;
          let nn = 20;

          ctx.fillStyle = "#ddd";
          ctx.strokeStyle = "#333";

          ctx.translate(width * 0.5, height * 0.4);
          ctx.beginPath();

          const line_n = 8;

          let l0;

          for (let k = 0; k <= line_n; k++) {


            ctx.setLineDash([]);

            let c0 = hex_to_color("#aaaaaa");
            let c = c0;
            let t = 0;
            if (k < line_n / 2) {
              t = 1 - k * 2 / line_n;
              c = hex_to_color("#297CDE");
            } else if (k > line_n / 2) {
              t = k * 2 / line_n - 1;
              c = hex_to_color("#FF951E");
            } else {
              ctx.setLineDash([s * 0.0092, s * 0.0092]);
              t = 1;
              c = hex_to_color("#777777");
            }

            ctx.strokeStyle = rgba_color_string(vec_lerp(c0, c, t));


            let length = 0;
            let prev_p = undefined;

            let hh = (1 - 2 * k / line_n) * h * 0.5;

            ctx.beginPath();
            for (let i = 0; i <= nn; i++) {

              let fi = (i / nn - 0.5) / rho;

              let c = cos(fi);
              let s = sin(fi);
              let r = rho + hh;

              let x = r * s;
              let y = r * c - rho;

              let p = project(mat4_mul_vec3(mvp, [x, 0, y]));

              ctx.lineTo(p[0], p[1]);

              if (prev_p) {
                length += vec_len(vec_sub(p, prev_p));
              }

              prev_p = p;
            }

            if (k == line_n / 2)
              l0 = length;

            ctx.stroke();

            let x0 = -width * 0.4;

            ctx.strokeLine(-length / 2, height * 0.4 - (-hh) * s,
              length / 2, height * 0.4 - (-hh) * s);
          }

          ctx.strokeStyle = "rgba(0,0,0,0.1)"
          ctx.save();
          ctx.translate(l0 / 2, height * 0.4);
          ctx.rotate(-slider_args[0] * 0.15);
          ctx.strokeLine(0, -height * 0.15, 0, height * 0.15);
          ctx.restore();

          ctx.save();
          ctx.translate(-l0 / 2, height * 0.4);
          ctx.rotate(slider_args[0] * 0.15);
          ctx.strokeLine(0, -height * 0.15, 0, height * 0.15);
          ctx.restore();

        } else if (mode === "bending_moment") {


          let s = width * 0.9;
          let nn = 20;

          ctx.fillStyle = "#ddd";
          ctx.strokeStyle = "#333";


          ctx.translate(width * 0.5, height * 0.5);
          ctx.beginPath();

          t = slider_args[0] * 2 - 1;

          const line_n = 7;
          ctx.lineCap = "butt";

          for (let k = 0; k <= 1; k++) {


            if (k == 0) {
              ctx.setLineDash([width * 0.012, width * 0.012]);
            } else {
              ctx.setLineDash([]);
              ctx.lineWidth = width * 0.01;
              ctx.strokeStyle = "rgba(0,0,0,0.3)";
            }


            let hh = (k == 0 ? 0 : t) * h * 0.5;

            ctx.beginPath();
            for (let i = 0; i <= nn; i++) {

              let fi = (i / nn - 0.5) * l / rho;

              let c = cos(fi);
              let s = sin(fi);
              let r = rho + hh;

              let x = r * s;
              let y = r * c - rho;

              let p = project(mat4_mul_vec3(mvp, [x, 0, y]));

              ctx.lineTo(p[0], p[1]);
            }

            ctx.stroke();
          }

          {
            let fi = -0.5 * l / rho;
            let c = cos(fi);
            let s = sin(fi);

            let r = rho;
            let x = r * s;
            let y = r * c - rho;

            let p0 = project(mat4_mul_vec3(mvp, [x, 0, y]));

            r = rho + h / 2 * t;
            x = r * s;
            y = r * c - rho;

            let p1 = project(mat4_mul_vec3(mvp, [x, 0, y]));

            ctx.lineWidth = width * 0.007;

            let color = t < 0 ? force4_color_css : force1_color_css;

            ctx.fillStyle = color[0];
            ctx.strokeStyle = color[1];

            ctx.strokeLine(p0[0], p0[1], p1[0], p1[1]);
            ctx.strokeLine(-p0[0], p0[1], -p1[0], p1[1]);

            let dir = vec_scale(vec_sub(p0, p1), -1.6);
            dir = [dir[1], -dir[0]];

            s = vec_len(dir);

            ctx.lineWidth = 1.5;
            ctx.arrow(p1[0], p1[1], p1[0] + dir[0], p1[1] + dir[1], 0.1 * s, 0.25 * s, 0.3 * s);
            ctx.fill();
            ctx.stroke();

            ctx.arrow(-p1[0], p1[1], -p1[0] - dir[0], p1[1] + dir[1], 0.1 * s, 0.25 * s, 0.3 * s);
            ctx.fill();
            ctx.stroke();
          }

        } else {
          ctx.feather(width * scale, height * scale,
            0, 0,
            canvas.height * 0.15, canvas.height * 0.15);
        }
      } else if (mode === "bending_force") {

        let ro = 0.04;
        let l = 0.7;
        let rho = -1e3;
        let sigma = 10 * slider_args[0];
        let color = [0.8, 0.8, 0.8, 1];
        let ratio = 0.6;

        let fs = 0.005 * slider_args[0];

        gl.begin(width, height);

        let mvp = translation_mat4([-(l * ratio) * 0.5, 0, 0]);
        mvp = mat4_mul(scale_mat4(1500), mvp);
        mvp = mat4_mul(mat3_to_mat4(rot), mvp);
        mvp = mat4_mul(ortho_proj, mvp);

        let mat = scale_mat4(fs * (1 - ratio));
        mat = mat4_mul(rot_z_mat4(pi / 2), mat);
        mat = mat4_mul(translation_mat4([-l / 2, 0, ro]), mat);

        let r = rot_z_mat3(pi / 2);

        gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force2_color, 10);


        mat = scale_mat4(fs * (ratio));
        mat = mat4_mul(rot_z_mat4(pi / 2), mat);
        mat = mat4_mul(translation_mat4([l * (1 + ratio - 0.5), 0, ro]), mat);

        gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force2_color, 10);



        mat = scale_mat4(fs);
        mat = mat4_mul(rot_z_mat4(pi / 2), mat);
        mat = mat4_mul(translation_mat4([l / 2, 0, ro]), mat);
        mat = mat4_mul(rot_x_mat4(pi), mat);

        r = mat3_mul(rot_x_mat3(pi), rot_z_mat3(pi / 2));


        gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force2_color, 10);


        gl.draw_rod(mvp, rot, [0, ro, l, rho], color, -sigma, undefined, true);

        mvp = mat4_mul(mvp, translation_mat4([l * 0.8, 0, 0]));
        mvp = mat4_mul(mvp, rot_z_mat4(pi));

        gl.draw_rod(mvp, rot, [0, ro, l * ratio, rho], color, -sigma, undefined, true);


        ctx.drawImage(gl.finish(), 0, 0, width, height);



      } else if (mode === "wheel") {

        let mvp = mat4_mul(vp, scale_mat4(3.2));
        mvp = mat4_mul(mvp, translation_mat4([0, -70, 0]));

        gl.begin(width, height);

        draw_wheel(mvp, rot, false, true);

        let mat = scale_mat4(1.5);
        mat = mat4_mul(rot_x_mat4(pi / 2), mat);
        mat = mat4_mul(translation_mat4([+hub_width / 2 + 20, 0, 0]), mat);

        let r = rot_x_mat3(pi / 2);

        gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force2_color, 10);

        mat = mat4_mul(translation_mat4([-hub_width - 40, 0, 0]), mat);

        gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force2_color, 10);

        mat = scale_mat4(3);
        mat = mat4_mul(rot_x_mat4(pi / 2), mat);
        mat = mat4_mul(rot_z_mat4(pi), mat);
        mat = mat4_mul(translation_mat4([0, tire_outer_R, 0]), mat);
        r = mat3_mul(rot_z_mat3(pi), r);

        gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force_color, 10);



        ctx.drawImage(gl.finish(), 0, 0, width, height);

      } else if (mode === "gyro" || mode === "gyro2") {

        if (state === undefined) {
          state = {};
          state.red = 0;
          state.dgreen = 0;
          state.green = 0;
          state.blue = 0;

          state.arrow = 0;

          state.dragged = false;
          state.slider = 0.5;
          state.slider_t = 0.0;
        }


        {
          if (sim_slider && sim_slider.dragged) {

            state.dragged = true;
            state.slider = slider_args[0];
            state.slider_t = 0.0;

          } else {

            if (state.dragged) {
              state.dragged = false;
            }

            state.slider_t += dt;


            let val = lerp(state.slider, 0.5, smooth_step(0, 0.15, state.slider_t));
            sim_slider.set_value(val);

            slider_args[0] = val;

          }
        }

        let Igreen = 1;
        let Iblue = 1;
        let Ired = 2;

        let torque = (slider_args[0] - 0.5) * 10;

        if (mode === "gyro") {
          state.dgreen += torque / Igreen * dt
          state.green += state.dgreen * dt;

          if (torque == 0 && state.dgreen == 0)
            self.set_paused(true);
        } else {

          let wred = -3;

          state.red += dt * wred;

          let Lred = wred * Ired;
          let w = torque / Lred;
          state.blue += w * dt;
        }



        let mvp = mat4_mul(vp, scale_mat4(3.2));
        mvp = mat4_mul(mvp, rot_z_mat4(-state.green));
        mvp = mat4_mul(mvp, rot_y_mat4(state.blue));

        let rr = mat3_mul(rot, mat3_mul(rot_z_mat3(-state.green), rot_y_mat3(state.blue)))

        let mat = rot_x_mat4(state.red);
        let r = rot_x_mat3(state.red);


        let ll = 380;

        gl.begin(width, height);

        draw_wheel(mat4_mul(mvp, mat), mat3_mul(rr, r), false, true);

        mat = scale_mat4([5, 80, 5])
        mat = mat4_mul(rot_z_mat4(pi / 2), mat);
        r = rot_z_mat3(pi / 2);

        gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rr, r), { color: force_color });


        mat = scale_mat4([5, ll, 5])
        mat = mat4_mul(rot_x_mat4(pi / 2), mat);
        r = rot_x_mat3(pi / 2);

        gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rr, r), { color: force2_color });


        mat = scale_mat4([5, ll, 5])
        r = ident_mat3;

        gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rr, r), { color: force1_color });



        mat = scale_mat4(abs(torque) * 0.6);
        if (torque > 0)
          mat = mat4_mul(x_flip_mat4, mat);


        state.arrow -= torque * dt;
        let ga = state.green + state.arrow;

        mat = mat4_mul(rot_x_mat4(pi / 2), mat);
        mat = mat4_mul(rot_z_mat4(ga), mat);
        mat = mat4_mul(translation_mat4([0, 0, ll]), mat);

        r = rot_x_mat3(pi / 2);
        r = mat3_mul(rot_z_mat3(ga), r);
        if (torque > 0)
          r = mat3_mul(r, x_flip_mat3);


        gl.draw_mesh("Moment_arrow", mat4_mul(mvp, mat), mat3_mul(rr, r), {
          color: force2_color
        });


        ctx.drawImage(gl.finish(), 0, 0, width, height);

      } else if (mode === "wheel_carriage_assembly" ||
        mode === "wheel_carriage_load" ||
        mode === "wheel_carriage_buckle") {

        if (state === undefined) {
          state = { buckle_angle: new Array(8) };
        }

        if (slider_args[0] == 0) {
          state.buckle_angle = [];
          for (let i = 0; i < 8; i++)
            state.buckle_angle.push(2 * pi * Math.random());
        }


        let rotation_angle = 0;
        let translation = 0;
        let force_scale = 1;
        let t = 1;
        let zoom = 2.8;


        let tension_function = function(i) {
          return 0.0;
        }


        if (mode === "wheel_carriage_assembly") {
          t = slider_args[0];

          zoom += 1 * smooth_step(0.4, 1.0, t);

        } else if (mode === "wheel_carriage_load") {
          rotation_angle = slider_args[0] * pi;
        } else if (mode === "wheel_carriage_buckle") {
          translation = slider_args[0] * 5;
          force_scale = slider_args[0];
        }

        if (mode === "wheel_carriage_load" || mode === "wheel_carriage_buckle") {
          tension_function = function(i) {

            let sum = 0;
            for (let k = 0; k < 8; k++) {
              let a = rotation_angle + k * pi / 4 + pi / 8;
              let f = max(0, sin(a));
              sum += f * f;
            }

            let a = rotation_angle + i * pi / 4 + pi / 8;
            let s = max(0, sin(a));

            return force_scale * s * s / sum;
          }
        }


        let t0 = smooth_step(0.0, 0.2, t);
        let t1 = smooth_step(0.25, 0.5, t);
        let ts = 1.0 - smooth_step(0.41, 0.5, t);
        let t2 = smooth_step(0.55, 0.75, t);
        let t3 = smooth_step(0.8, 1, t);

        gl.begin(width, height);

        let mvp = translation_mat4([60, 0, 0]);
        mvp = mat4_mul(scale_mat4(zoom), mvp);
        mvp = mat4_mul(vp, mvp);

        if (mode === "wheel_carriage_load" || mode === "wheel_carriage_buckle") {
          let r = rot_x_mat3(rotation_angle);
          mvp = translation_mat4([60, 0, 0]);
          mvp = mat4_mul(scale_mat4(2.0), mvp);
          mvp = mat4_mul(mat3_to_mat4(mat3_mul(rot, r)), mvp);
          mvp = mat4_mul(translation_mat4([0, 30, 0]), mvp);
          mvp = mat4_mul(ortho_proj, mvp);
        }

        for (let i = 0; i < 8; i++) {

          let mat = rot_x_mat4(i * pi * 2 / 8);
          let r = rot_x_mat3(i * pi * 2 / 8);

          gl.draw_mesh("Hub_wood", mat4_mul(mvp, mat4_mul(translation_mat4([0, -translation, 0]), mat)), mat3_mul(rot, r), {
            shader: "wood",
            m_pos: rot_x_mat3(-i * pi * 2 / 8),
          });

          gl.draw_mesh("Tire_iron", mat4_mul(mvp, mat4_mul(mat, translation_mat4([(1 - t2) * -130, 0, 0]))), mat3_mul(rot, r));

          let arrow_scale = tension_function(i);

          mat = mat4_mul(mat, rot_x_mat4(pi / 8));
          mat = mat4_mul(mat, translation_mat4([0, (1 - t0) * 50 + 5 - (1 - ts) * 5, 0, 0]))
          mat = mat4_mul(mat, rot_x_mat4(-pi / 8));

          mat = mat4_mul(rot_x_mat4(ts * 0.04 * (i & 1 ? -1 : 1)), mat);


          if (mode === "wheel_carriage_buckle") {


            let hub_R = 60;
            let rim_inner_R = 280;

            let a = i * 2 * pi / 8 + pi / 2 + pi / 8;

            let p0 = [-60, cos(a) * hub_R, sin(a) * hub_R];
            p0[1] -= translation;

            let p1 = [-60, cos(a) * rim_inner_R, sin(a) * rim_inner_R];

            let spoke_vector = vec_sub(p1, p0);

            a = atan2(spoke_vector[2], spoke_vector[1]);
            let l = vec_len(spoke_vector);

            if (i == 0 || i == 3)
              l = 220;

            let rot_z = 0;


            let mat = rot_z_mat4(rot_z);
            mat = mat4_mul(rot_x_mat4(a - pi / 2), mat);
            mat = mat4_mul(translation_mat4(p0), mat);
            mat = mat4_mul(mvp, mat);

            let r = rot_z_mat3(rot_z);
            r = mat3_mul(rot_x_mat3(a - pi / 2), r);
            r = mat3_mul(rot, r);

            let bend = spoke_bend(220, l);
            let bend_a = state.buckle_angle[i];

            gl.draw_flex_tube(mat, r, models_colors["Spoke_wood"], 250, [bend * cos(bend_a), bend * sin(bend_a)], 6, true);

          } else {

            let rad = 16;
            let mm = translation_mat4([0, 1, 0]);
            mm = mat4_mul(scale_mat4([rad, 222.22 / 2, rad]), mm);
            mm = mat4_mul(translation_mat4([-60, 67.082, 0]), mm);
            mm = mat4_mul(rot_x_mat4(pi / 8), mm);

            let rr = mat3_mul(r, rot_x_mat3(pi / 8));

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mat4_mul(mat, mm)), mat3_mul(rot, rr), {
              shader: "wood",
              m_pos: mat3_mul(rot_x_mat3(i), scale_mat3(100)),
              color: models_colors["Spoke_wood"],
            });

            mm = translation_mat4([0, 1, 0]);
            mm = mat4_mul(scale_mat4([7, 10, 7]), mm);
            mm = mat4_mul(translation_mat4([-60, 67.082 - 20, 0]), mm);
            mm = mat4_mul(rot_x_mat4(pi / 8), mm);

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mat4_mul(mat, mm)), mat3_mul(rot, rr), {
              shader: "wood",
              m_pos: mat3_mul(rot_x_mat3(i), scale_mat3(100)),
              color: models_colors["Spoke_wood"],
            });

            mm = translation_mat4([0, 1, 0]);
            mm = mat4_mul(scale_mat4([7, 10, 7]), mm);
            mm = mat4_mul(translation_mat4([-60, 67.082 + 222.22, 0]), mm);
            mm = mat4_mul(rot_x_mat4(pi / 8), mm);

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mat4_mul(mat, mm)), mat3_mul(rot, rr), {
              shader: "wood",
              m_pos: mat3_mul(rot_x_mat3(i), scale_mat3(100)),
              color: models_colors["Spoke_wood"],
            });
          }


          if (arrow_scale == 0 || mode === "wheel_carriage_buckle")
            continue;

          for (let k = 0; k < 2; k++) {
            let mat = scale_mat4(3 * arrow_scale);

            mat = mat4_mul(rot_x_mat4(k ? -pi / 2 : pi / 2), mat);
            mat = mat4_mul(translation_mat4([0, k ? 290 : 65, 0]), mat);

            mat = mat4_mul(rot_x_mat4((i + 0.5) / 8 * 2 * pi + pi / 2), mat);
            mat = mat4_mul(translation_mat4([-140, 0, 0]), mat);
            mat = mat4_mul(mvp, mat);

            gl.draw_arrow(mat, rot, force_color);
          }
        }

        for (let i = 0; i < 4; i++) {

          let mat = rot_x_mat4(i * pi * 2 / 4);
          let r = rot_x_mat3(i * pi * 2 / 4);

          mat = mat4_mul(mat, rot_x_mat4(pi / 4));
          mat = mat4_mul(mat, translation_mat4([0, (1 - t1) * 150, 0, 0]))
          mat = mat4_mul(mat, rot_x_mat4(-pi / 4));

          gl.draw_mesh("Felloe", mat4_mul(mvp, mat), mat3_mul(rot, r), {
            shader: "wood",
            m_pos: r,
          });


          mat = z_flip_mat4;
          mat = mat4_mul(rot_x_mat4(i * pi * 2 / 4), mat);
          mat = mat4_mul(mat, rot_x_mat4(pi / 4));
          mat = mat4_mul(mat, translation_mat4([0, (1 - t1) * 150, 0, 0]))
          mat = mat4_mul(mat, rot_x_mat4(-pi / 4));

          r = z_flip_mat3;
          r = mat3_mul(rot_x_mat3(i * pi * 2 / 4), r);

          gl.draw_mesh("Felloe", mat4_mul(mvp, mat), mat3_mul(rot, r), {
            shader: "wood",
            m_pos: r
          });
        }

        {
          // axle

          let mat = scale_mat4([30, 80, 30]);
          mat = mat4_mul(rot_z_mat4(pi / 2), mat);
          mat = mat4_mul(translation_mat4([-60 - (1 - t3) * 200, 0, 0]), mat);
          let rr = rot_z_mat3(pi / 2);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat4_mul(translation_mat4([0, -translation, 0]), mat)), mat3_mul(rot, rr), {
            shader: "wood",
            m_pos: mat3_mul(rot_x_mat3(0), scale_mat3(100)),
            color: hex_to_color("#DCB790"),
          });

        }

        if (mode === "wheel_carriage_load" || mode === "wheel_carriage_buckle") {

          let mat = scale_mat4(3 * force_scale);
          mat = mat4_mul(rot_x_mat4(pi / 2), mat);
          mat = mat4_mul(translation_mat4([-60, -360, 0]), mat);
          mvp = mat4_mul(mvp, rot_x_mat4(-rotation_angle));


          let c = force6_color;

          let r = rot_x_mat3(pi / 2 - rotation_angle);

          gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), c);

          if (mode === "wheel_carriage_buckle")
            mat = mat4_mul(mat, scale_mat4(0.5));

          mat = mat4_mul(mat, rot_x_mat4(pi));
          mat = mat4_mul(translation_mat4([60, 390 - translation, 0]), mat);

          r = rot_x_mat3(pi * 3 / 2 - rotation_angle);

          if (mode === "wheel_carriage_buckle")
            gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), c);


          mat = mat4_mul(translation_mat4([-120, 0, 0]), mat);

          gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), c);


        }

        if (mode === "wheel_carriage_load") {
          ctx.globalCompositeOperation = "destination-over";

          let grd = ctx.createLinearGradient(0, 0, 0, height);
          grd.addColorStop(0.0, "#D1E8F5");
          grd.addColorStop(1.0, "#fff");
          ctx.fillStyle = grd;

          ctx.fillRect(0, 0, width * 2, height * 2);
          ctx.globalCompositeOperation = "source-over";

          ctx.save();
          ctx.translate(width / 2, height / 2);
          let p1 = project(mat4_mul_vec3(mvp, [0, -360, 0]));

          let pp = project(mat4_mul_vec3(mvp, [0, 0, 0]));

          let dscale = (p1[1] - pp[1]);

          draw_ground(rotation_angle * dscale, p1[1], width, height, true);



          ctx.feather(width * scale, height * scale,
            canvas.height * 0.15, canvas.height * 0.15,
            canvas.height * 0.15, canvas.height * 0.15);
          ctx.restore();


        }


        ctx.drawImage(gl.finish(), 0, 0, width, height);




      } else if (mode === "wheel_grabber") {

        if (state === undefined) {
          state = {};
          state.angle = 0;
          state.omega = 0;
          state.dragging = false;
          state.dragged_index = 0;

          state.alpha = 1;
          state.dalpha = 0;
        }

        let n = 32;


        function handle_position(i) {
          let p = [width / 2, height / 2];
          p[0] += cos(i * 2 * pi / n + state.angle) * width * 0.317;
          p[1] += sin(i * 2 * pi / n + state.angle) * width * 0.317;
          return p;
        }

        if (drag_point) {

          if (!state.dragging) {
            let best_dist = Infinity;
            let best_ind = -1;
            for (let i = 0; i < n; i++) {
              let dist = vec_len(vec_sub(drag_start_point, handle_position(i)));
              if (dist < best_dist) {
                best_dist = dist;
                best_ind = i;
              }
            }

            if (best_dist < 30) {
              state.dragging = true;
              state.dragged_index = best_ind;
              state.start = handle_position(state.dragged_index);

              state.dalpha = -1;

              self.set_paused(false);
            }

          }

          state.last_drag_point = drag_point;


        } else if (state.dragging) {

          let c = [width / 2, height / 2];
          let p = handle_position(state.dragged_index);
          let to_center = vec_norm(vec_sub(c, p));
          let to_point = vec_sub(state.last_drag_point, p);

          let force = (to_point[0] * to_center[1] - to_point[1] * to_center[0]) / width;

          state.start = p;
          state.omega = force * 10;

          state.dalpha = 1;

          state.dragging = false;
        }

        if (!state.dragging) {

          state.omega -= dt * state.omega * 0.3;
          state.angle += state.omega * dt;

          if (abs(state.omega) < 0.01 && state.alpha == 1)
            self.set_paused(true);
        }

        state.alpha = saturate(state.alpha + state.dalpha * dt * 4);


        let mvp = mat4_mul(mat4_mul(vp, scale_mat4(3)), rot_x_mat4(state.angle));
        let r = rot;
        let l = radial_spoke_L;
        gl.begin(width, height);

        draw_wheel(mvp, r, true);

        ctx.drawImage(gl.finish(), 0, 0, width, height);

        ctx.globalAlpha = 0.8 * state.alpha;

        ctx.fillStyle = "#bbb";

        for (let i = 0; i < n; i++) {
          let p = handle_position(i);

          ctx.fillEllipse(p[0], p[1], width * 0.025);
        }

        ctx.globalAlpha = 1 * (1 - state.alpha);

        if (ctx.globalAlpha > 0) {

          let p = state.start;
          let pp = state.last_drag_point;
          let d = vec_len(vec_sub(pp, p))

          let r0 = width * 0.005;
          let r1 = r0 + d * 0.15;

          let grd = ctx.createRadialGradient(pp[0], pp[1], r1,
            p[0], p[1], r0);


          let pref = "rgba(233, 86, 77,"
          grd.addColorStop(0, pref + "0)");

          for (let i = 0; i < 100; i++) {
            let t0 = (i * 10) / d + 0.001;
            let t1 = (i * 10 + 10) / d + 0.001;

            if (t0 >= 0.999 || t1 >= 0.999)
              break;

            let a = 0.6 * (1 - t0 * t0) + 0.3;

            grd.addColorStop(t0, pref + (a) + ")");
            grd.addColorStop(t0, pref + (i & 1 ? 0.0 : a) + ")");
            grd.addColorStop(t1, pref + (i & 1 ? 0.0 : a) + ")");
            grd.addColorStop(t1, pref + (a) + ")");
          }


          grd.addColorStop(0.999, pref + "0.5)");
          grd.addColorStop(1, pref + "0)");

          ctx.fillStyle = grd;
          ctx.fillRect(-width, -height, 2 * width, 2 * height);

          ctx.fillStyle = "#bbb";

          ctx.fillEllipse(p[0], p[1], width * 0.025);

        }

        ctx.feather(width * scale, height * scale,
          canvas.height * 0.1, canvas.height * 0.1,
          canvas.height * 0.1, canvas.height * 0.1);

      } else if (mode === "bike_trail") {


        let steer_axis_angle = (73 - (slider_args[0] - 0.3) * 10) * pi / 180;
        let steer_axis = [-cos(steer_axis_angle), sin(steer_axis_angle), 0];

        let fork_offset = lerp(0, 50, slider_args[1]);

        let front_down = vec_sub(front_up, vec_scale(steer_axis, 80));

        let dx1 = -front_down[1] * tan(steer_axis_angle - pi / 2);
        let dx2 = fork_offset / cos(steer_axis_angle - pi / 2);


        let front = front_down.slice();
        front[1] = 0;
        front[0] += dx1 + dx2;

        rot = ident_mat3;
        let mvp = mat4_mul(ortho_proj, scale_mat4(2.0));
        mvp = mat4_mul(mvp, translation_mat4([-900, -110, 0]));

        gl.begin(width, height);

        draw_bike(mvp, rot, {
          steer_axis_angle: steer_axis_angle,
          fork_offset: fork_offset,
        });


        ctx.drawImage(gl.finish(), 0, 0, width, height);


        ctx.translate(width / 2, height / 2);

        let p0 = project(mat4_mul_vec3(mvp, [front[0], -tire_outer_R, 0]));


        let ffd = vec_sub(front_up, vec_scale(steer_axis, (front_up[1] + tire_outer_R) / steer_axis[1]));
        let p1 = project(mat4_mul_vec3(mvp, ffd));
        let p2 = project(mat4_mul_vec3(mvp, vec_add(front_up, vec_scale(steer_axis, 80))));



        let s = width * 0.01;

        ctx.lineWidth = s * 0.4;
        ctx.strokeStyle = "rgba(0,0,0,0.5)"
        ctx.setLineDash([s, s]);
        ctx.strokeLine(p1[0], p1[1], p2[0], p2[1]);

        ctx.setLineDash([]);

        ctx.lineWidth = s * 0.3;
        ctx.strokeStyle = "#aaa";

        ctx.strokeLine(-width, p1[1], width, p0[1]);

        ctx.lineWidth = s * 1.3;
        ctx.strokeStyle = force_color_css[1];
        ctx.strokeLine(p1[0], p1[1], p0[0], p0[1]);

        ctx.lineWidth = s * 1.0;
        ctx.strokeStyle = force_color_css[0];
        ctx.strokeLine(p1[0], p1[1], p0[0], p0[1]);

        ctx.fillStyle = "#444";
        ctx.fillEllipse(p0[0], p0[1], s * 1.1);
        ctx.fillStyle = "#eee";
        ctx.fillEllipse(p0[0], p0[1], s * 0.8);

        ctx.fillStyle = "#222";
        ctx.fillEllipse(p1[0], p1[1], s * 1.1);
        ctx.fillStyle = "#555";
        ctx.fillEllipse(p1[0], p1[1], s * 0.8);

        ctx.lineCap = "butt";

        let parc = project(mat4_mul_vec3(mvp, [900, 0, 0]));

        let dd = vec_len(vec_sub(parc, p1));



        ctx.lineWidth = s * 1.3;
        ctx.strokeStyle = force1_color_css[1];

        ctx.beginPath();
        ctx.arc(p1[0], p1[1], dd, Math.PI + steer_axis_angle, Math.PI, true);
        ctx.stroke();

        ctx.lineWidth = s * 0.9;
        ctx.strokeStyle = force1_color_css[0]
        ctx.stroke();

        p1 = project(mat4_mul_vec3(mvp, front));
        p2 = project(mat4_mul_vec3(mvp, vec_add(front,
          [-steer_axis[1] * fork_offset,
            steer_axis[0] * fork_offset, 0
          ])));


        ctx.lineWidth = s * 1.3;
        ctx.strokeStyle = force6_color_css[1];

        ctx.strokeLine(p1[0], p1[1], p2[0], p2[1]);
        ctx.lineWidth = s * 0.9;
        ctx.strokeStyle = force6_color_css[0]
        ctx.strokeLine(p1[0], p1[1], p2[0], p2[1]);

        ctx.feather(width * scale, height * scale,
          canvas.height * 0.2, 0, 0, 0);


      } else if (mode === "wheel_spoke") {

        let scale = 6;
        let l = radial_spoke_L;
        gl.begin(width, height);

        let r = mat3_mul(rot, rot_y_mat3(pi / 2));

        let mvp = mat4_mul(mat4_mul(ortho_proj, mat3_to_mat4(r)), scale_mat4(4));
        mvp = mat4_mul(mvp, translation_mat4([0, 0, -l / 2]));

        r = mat3_mul(rot_y_mat3(0.3), r);

        let mat = scale_mat4([1, 1, l - spoke_knee_R - spoke_thread_L]);
        mat = mat4_mul(translation_mat4([0, 0, spoke_knee_R]), mat);

        gl.draw_simple_mesh("tube", mat4_mul(mvp, mat), r, hex_to_color("#cccccc"));

        gl.draw_simple_mesh("knee", mvp, r, force1_color);

        mat = translation_mat4([0, 0, l - spoke_thread_L]);
        gl.draw_thread(mat4_mul(mvp, mat), r, force_color);

        let base_mvp = mvp;


        let rr = height * 0.5 - 3;

        gl.scissors(2, 0, rr * 2, rr * 2);


        mvp = mat4_mul(mvp, translation_mat4([0, 0, l / 2]));
        mvp = mat4_mul(scale_mat4(scale), mvp);
        mvp = mat4_mul(translation_mat4([-0.85, 0, 0]), mvp);

        mat = scale_mat4([1, 1, l - spoke_knee_R - spoke_thread_L]);
        mat = mat4_mul(translation_mat4([0, 0, spoke_knee_R]), mat);

        gl.draw_simple_mesh("tube", mat4_mul(mvp, mat), r, hex_to_color("#cccccc"));
        gl.draw_simple_mesh("knee", mvp, r, force1_color);

        gl.scissors(width - 2 * rr - 2, 0, rr * 2, rr * 2);

        mat = mat4_mul(translation_mat4([0, 0, -181]), mat);

        gl.draw_simple_mesh("tube", mat4_mul(mvp, mat), r, hex_to_color("#cccccc"));

        mat = translation_mat4([0, 0, 62]);



        gl.draw_thread(mat4_mul(mvp, mat), r, force_color);




        ctx.drawImage(gl.finish(), 0, 0, width, height);

        ctx.translate(width / 2, height / 2);

        let p0 = project(mat4_mul_vec3(base_mvp, [0, 0, 0])).slice(0, 2);

        let p1 = project(mat4_mul_vec3(base_mvp, [0, 0, l - 2])).slice(0, 2);


        draw_zoom(rr, rr / scale, [-width * 0.5 + rr + 2, 0], p0);

        draw_zoom(rr, rr / scale, [width * 0.5 - rr - 2, 0], p1);


      } else if (mode === "wheel_spoke_forces") {

        let nipple_a = slider_args[0] * -40;


        gl.begin(width, height);

        let r = mat3_mul(rot, rot_y_mat3(pi / 2));

        let mvp = mat4_mul(mat4_mul(ortho_proj, mat3_to_mat4(r)), scale_mat4(3.5));
        mvp = mat4_mul(mvp, translation_mat4([0, 0, -60]));

        let mat = translation_mat4([0, 0, -62]);

        draw_spoke(mat4_mul(mvp, mat), mat3_mul(rot, r), radial_spoke_L);

        mat = rot_x_mat4(-pi / 2);
        mat = mat4_mul(rot_z_mat4(nipple_a), mat);
        mat = mat4_mul(translation_mat4([0, 0, 269.5]), mat);

        gl.draw_mesh("Nipple", mat4_mul(mvp, mat), mat3_mul(r, mat3_mul(rot_z_mat3(nipple_a), rot_x_mat3(-pi / 2))));

        mat = translation_mat4([0, 0, -180]);
        draw_hub(mat4_mul(mvp, mat), mat3_mul(rot, r));


        mat = rot_y_mat4(pi);
        mat = mat4_mul(rot_x_mat4(pi / 2 - 1.5 * pi / 16), mat);

        for (let i = 0; i < 3; i++) {
          mat = mat4_mul(rot_x_mat4(+pi / 16), mat);
          gl.draw_mesh("Rim", mat4_mul(mvp, mat), mat3_mul(rot, r));
        }


        let sc = slider_args[0] * 0.6;

        mat = mat4_mul(translation_mat4([0, 0, 192 + 60 * sc]), mat4_mul(scale_mat4(sc), rot_y_mat4(pi)));
        gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force_color, 20);

        mat = mat4_mul(translation_mat4([0, 0, -140.5 + 60 * sc]), mat4_mul(scale_mat4(sc), rot_y_mat4(pi)));
        gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force_color, 20);

        mat = mat4_mul(translation_mat4([0, 0, -66 - 60 * sc]), scale_mat4(sc));
        gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force_color, 20);

        mat = mat4_mul(translation_mat4([0, 0, 267 - 60 * sc]), scale_mat4(sc));
        gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force_color, 20);

        ctx.drawImage(gl.finish(), 0, 0, width, height);


        ctx.feather(width * scale, height * scale,
          0, 0,
          canvas.height * 0.2, canvas.height * 0.2);

      } else if (mode === "wheel_spokes_action") {
        gl.begin(width, height);


        let vp = mat4_mul(rot_z_mat4(pi / 2), rot_y_mat4(pi / 2));
        vp = mat4_mul(translation_mat4([-280, 0, 2]), vp);
        vp = mat4_mul(scale_mat4(50), vp);
        let mvp = mat4_mul(ortho_proj, vp);

        let rot = mat3_mul(rot_x_mat3(0.4), rot_y_mat3(pi / 2));

        let pitch = spoke_thread_L / 18;

        let nipple_a = slider_args[0] * -30 + 30;

        let tr = pitch * nipple_a / (2 * pi);

        let limit = 272.25;
        let nipple_tr = -1.5 + tr;
        let spoke_tr = hub_R - (min(0, nipple_tr)) - 2;
        nipple_tr = limit + max(0, nipple_tr);


        gl.draw_mesh("Rim", mat4_mul(mvp, rot_x_mat4(pi - pi / 32)), rot, { shader: "dashed", args: [1, 0, 0, -10.0] });

        for (let i = 0; i < 1; i++) {

          let z_rot = pi / 2;
          let x_rot = i / n_spokes * 2 * pi;


          {

            let mat = rot_z_mat4(z_rot);
            mat = mat4_mul(translation_mat4([0, 0, spoke_tr]), mat);
            mat = mat4_mul(rot_x_mat4(x_rot + pi / 2), mat);

            let r = rot_z_mat3(z_rot);
            r = mat3_mul(rot_x_mat3(x_rot + pi / 2), r);

            draw_spoke(mat4_mul(mvp, mat), mat3_mul(rot, r), radial_spoke_L + 2.1, [0, 0], true, hex_to_color("#bbbbbb"));
          } {

            let mat = rot_x_mat4(pi);
            mat = mat4_mul(rot_y_mat4(nipple_a), mat);
            mat = mat4_mul(translation_mat4([0, nipple_tr, 0]), mat);
            mat = mat4_mul(rot_x_mat4(x_rot + pi), mat);

            let nmat = mat;

            let r = rot_x_mat3(pi);
            r = mat3_mul(rot_y_mat3(nipple_a), r);
            r = mat3_mul(rot_x_mat3(x_rot + pi), r);

            let nr = r;

            gl.draw_mesh("Nipple", mat4_mul(mvp, mat), mat3_mul(rot, r), {
              shader: "dashed",
              skip_lines: true,
              args: [cos(-nipple_a), 0, sin(-nipple_a), 0]
            });

            mat = mat4_mul(mat, translation_mat4([0, -5.5, 0]));
            mat = mat4_mul(mat, rot_x_mat4(pi / 2));
            mat = mat4_mul(mat, rot_z_mat4(-pi));

            r = mat3_mul(r, rot_x_mat3(pi / 2));

            let mm = mat4_mul(mvp, mat);

            gl.draw_thread(mm, mat3_mul(rot, r),
              models_colors["Nipple"],
              [cos(-nipple_a + pi), sin(-nipple_a + pi), 0, 0]
            );



          }

        }

        ctx.drawImage(gl.finish(), 0, 0, width, height);

        ctx.feather(width * scale, height * scale,
          canvas.height * 0.15, canvas.height * 0.15,
          canvas.height * 0.15, canvas.height * 0.15);

      } else if (mode === "wheel_spokes_assembly2") {

        gl.begin(width, height);

        let t = slider_args[0];
        let rim_t = smooth_step(0, 0.2, t);

        let mvp = mat4_mul(vp, scale_mat4(4));
        mvp = mat4_mul(mvp, translation_mat4([(1 - rim_t) * 50, 0, 0]));



        for (let i = 0; i < n_spokes; i++) {

          let spoke_t = smooth_step(0.2 + 0.7 * i / n_spokes, 0.3 + 0.7 * i / n_spokes, t);

          let shrink = 15 * (smooth_step(0, 0.3, spoke_t) - smooth_step(0.7, 1.0, spoke_t));
          let z_rot = i & 1 ? pi : 0;
          let x_rot = i / n_spokes * 2 * pi;
          let y_rot = 0.01 * (i & 1 ? 1 : -1) + 0.05 * (rim_t - smooth_step(0.2, 0.7, spoke_t));

          let offset = -3 * (i & 1 ? 1 : -1);

          {
            let r = rot_z_mat3(z_rot);
            r = mat3_mul(rot_y_mat3(y_rot), r);
            r = mat3_mul(rot_x_mat3(x_rot + pi / 2), r);


            let mat = rot_z_mat4(z_rot);
            mat = mat4_mul(rot_y_mat4(y_rot), mat);
            mat = mat4_mul(translation_mat4([offset, 0, hub_R]), mat);
            mat = mat4_mul(rot_x_mat4(x_rot + pi / 2), mat);

            let expected_length = radial_spoke_L - shrink;

            let bend = spoke_bend(radial_spoke_L, expected_length);
            let bend_a = 0.5 * ((sin(i) * 43758.5453) % 1);

            draw_spoke(mat4_mul(mvp, mat), mat3_mul(rot, r), expected_length,
              [bend * cos(bend_a), bend * sin(bend_a)]);
          }
        }

        draw_hub_simple(mvp, rot);
        draw_rim(mat4_mul(mvp, translation_mat4([(rim_t - 1) * 100, 0, 0])), rot);



        ctx.drawImage(gl.finish(), 0, 0, width, height);

      } else if (mode === "wheel_spokes_assembly3") {


        let t = slider_args[0];

        let zoom_t = smooth_step(0, 0.15, t) - smooth_step(0.85, 1.0, t);
        let feather_t = zoom_t;
        let nipple_t = sharp_step(0.2, 0.8, t);

        let rim_a = 0.15;

        let nipple_tr_t = smooth_step(0.0, 0.2, nipple_t);
        let nipple_a_t = smooth_step(0.2, 1, nipple_t);

        let nipple_a = 70 * (1 - nipple_a_t);
        let nipple_tr = nipple_a * 0.5 / (2 * pi) + (1 - nipple_tr_t) * 60;


        let mvp = translation_mat4([0, 0, (rim_inner_R + 20) * zoom_t]);
        mvp = mat4_mul(scale_mat4(3.8), mvp);

        mvp = mat4_mul(mat3_to_mat4(rot), mvp);
        mvp = mat4_mul(translation_mat4([0, 0, 5500 * zoom_t]), mvp);
        mvp = mat4_mul(proj, mvp);
        mvp = mat4_mul(scale_mat4([1, 1, 0.4]), mvp);


        gl.begin(width, height);

        for (let i = 0; i < n_spokes; i++) {

          let spoke_t = smooth_step(0.2 + 0.7 * i / n_spokes, 0.3 + 0.7 * i / n_spokes, t);

          let shrink = 15 * (smooth_step(0, 0.3, spoke_t) - smooth_step(0.7, 1.0, spoke_t));
          let z_rot = i & 1 ? pi : 0;
          let x_rot = i / n_spokes * 2 * pi;
          let y_rot = 0.01 * (i & 1 ? 1 : -1);

          let offset = -3 * (i & 1 ? 1 : -1);

          {
            let r = rot_z_mat3(z_rot);
            r = mat3_mul(rot_y_mat3(y_rot), r);
            r = mat3_mul(rot_x_mat3(x_rot + pi / 2), r);


            let mat = rot_z_mat4(z_rot);
            mat = mat4_mul(rot_y_mat4(y_rot), mat);
            mat = mat4_mul(translation_mat4([offset, 0, hub_R]), mat);
            mat = mat4_mul(rot_x_mat4(x_rot + pi / 2), mat);

            draw_spoke(mat4_mul(mvp, mat), mat3_mul(rot, r), radial_spoke_L);


            mat = mat4_mul(mat, rot_z_mat4(nipple_a));
            mat = mat4_mul(mat, rot_x_mat4(pi / 2));
            mat = mat4_mul(mat, translation_mat4([0, radial_spoke_L - 14 + nipple_tr, 0]));
            mat = mat4_mul(mat, rot_z_mat4(pi));

            r = mat3_mul(r, rot_z_mat3(nipple_a));
            r = mat3_mul(r, rot_x_mat3(pi / 2));
            r = mat3_mul(r, rot_z_mat3(pi));

            gl.draw_mesh("Nipple", mat4_mul(mvp, mat), mat3_mul(rot, r));
          }
        }

        draw_hub_simple(mvp, rot);


        let rim_color = vec_scale(models_colors["Rim"], rim_a);
        draw_rim(mvp, rot, {
          color: rim_color
        });


        ctx.drawImage(gl.finish(), 0, 0, width, height);

        ctx.feather(width * scale, height * scale,
          canvas.height * 0.15 * feather_t, canvas.height * 0.15 * feather_t,
          canvas.height * 0.15 * feather_t, canvas.height * 0.15 * feather_t);

      } else if (mode === "wheel_spokes_assembly") {

        let t = slider_args[0];

        let zoom_t = smooth_step(0.0, 0.2, t);
        let zoom2_t = smooth_step(0.8, 1.0, t);
        let feather_t = 1.0 - smooth_step(0.95, 1.0, t);
        let rotation_angle = pi * 1.01 / 2;


        let mvp = scale_mat4(5 + zoom_t * 15 - zoom2_t * 15.5);
        mvp = mat4_mul(vp, mvp);


        gl.begin(width, height);

        draw_hub_simple(mvp, rot);


        for (let i = 0; i < n_spokes; i++) {

          let pt = 0.1;
          let tt = i / n_spokes;
          let thread_t = smooth_step(0.25 + pt * tt, 0.5 - pt + pt * tt, t);

          let rot_t = smooth_step(0.5 + pt * tt, 0.75 - pt + pt * tt, t);

          let r = rot_y_mat3(pi / 2);
          r = mat3_mul(rot_x_mat3(-pi / 2), r);
          r = mat3_mul(rot_z_mat3(rot_t * rotation_angle), r);
          r = mat3_mul(mat3_mul(rot_x_mat3(pi * 2 * i / n_spokes), rot_y_mat3(i & 1 ? pi : 0)), r);
          r = mat3_mul(rot, r);

          let dy0 = -spoke_knee_R + -(radial_spoke_L + 20) * (1 - thread_t);

          let mat = rot_y_mat4(pi / 2);
          mat = mat4_mul(rot_x_mat4(-pi / 2), mat);
          mat = mat4_mul(translation_mat4([dy0, -spoke_knee_R, 0]), mat);
          mat = mat4_mul(rot_z_mat4(rot_t * rotation_angle), mat);
          mat = mat4_mul(translation_mat4([0, hub_R + spoke_knee_R, 0]), mat);
          mat = mat4_mul(mat4_mul(rot_x_mat4(pi * 2 * i / n_spokes), rot_y_mat4(i & 1 ? pi : 0)), mat);
          mat = mat4_mul(mvp, mat);

          draw_spoke(mat, r, radial_spoke_L);
        }

        ctx.drawImage(gl.finish(), 0, 0, width, height);


        ctx.feather(width * scale, height * scale,
          canvas.height * 0.15 * feather_t, canvas.height * 0.15 * feather_t,
          canvas.height * 0.15 * feather_t, canvas.height * 0.15 * feather_t);

      } else if (mode === "wheel_spokes_force_radius1" || mode === "wheel_spokes_force_radius2") {

        let vp = mat4_mul(ortho_proj, mat3_to_mat4(rot));
        let mvp = scale_mat4(2.7);
        mvp = mat4_mul(vp, mvp);

        let hub_rotation_angle = 0;
        let arrow_rotation_angle = slider_args[0] * pi / 2;

        let ll;

        if (mode === "wheel_spokes_force_radius2") {
          mvp = translation_mat4([0, 0, rim_inner_R / 2]);
          mvp = mat4_mul(scale_mat4(4.7), mvp);
          mvp = mat4_mul(vp, mvp);

          hub_rotation_angle = slider_args[0] * 0.2;

          let h = hub_R * sin(hub_rotation_angle);
          let d0 = hub_R * cos(hub_rotation_angle);
          let d1 = rim_inner_R - d0;
          ll = sqrt(d1 * d1 + h * h);
          arrow_rotation_angle = atan2(h, d1);
        }

        let hub_rot = rot_x_mat3(hub_rotation_angle);


        gl.begin(width, height);

        draw_hub(mat4_mul(mvp, mat3_to_mat4(hub_rot)), rot);
        draw_rim(mvp, rot);

        draw_radial_spokes(mvp, rot, { hub_rot: hub_rot });

        ctx.drawImage(gl.finish(), 0, 0, width, height);


        ctx.translate(width / 2, height / 2);

        let p0 = project(mat4_mul_vec3(mvp, [0, 0, 0]));


        let p1 = project(mat4_mul_vec3(mvp, [0, 0, -rim_inner_R]));
        let r0 = abs(p1[0] - p0[0]) * sin(arrow_rotation_angle);

        ctx.save();
        ctx.translate(p0[0], p0[1]);
        ctx.fillEllipse(0, 0, 2);
        ctx.strokeStyle = "rgba(0,0,0,0.5)"
        ctx.strokeEllipse(0, 0, r0);

        ctx.restore();


        ctx.save();
        ctx.translate(p0[0], p0[1]);

        ctx.lineCap = "butt";
        ctx.lineWidth = width * 0.015;
        ctx.strokeStyle = force2_color_css[1];
        ctx.rotate(-arrow_rotation_angle - pi / 2);
        ctx.strokeLine(0, 0, r0, 0);
        ctx.lineWidth = width * 0.01;
        ctx.strokeStyle = force2_color_css[0];
        ctx.strokeLine(0, 0, r0, 0);
        ctx.restore();


        ctx.save();

        ctx.translate(p1[0], p1[1]);
        ctx.setLineDash([4, 6]);

        if (mode === "wheel_spokes_force_radius2") {

          ctx.strokeStyle = "rgba(0,0,0,0.5)";
          ctx.strokeLine(width, 0, -width, 0);
        }

        ctx.rotate(-arrow_rotation_angle);
        ctx.strokeStyle = "rgba(0,0,0,0.5)"
        ctx.strokeLine(width, 0, -width, 0);

        ctx.setLineDash([]);
        ctx.fillStyle = force_color_css[0];
        ctx.strokeStyle = force_color_css[1];

        let s = width * 0.2;
        if (mode === "wheel_spokes_force_radius1") {

          ctx.arrow(0, 0, s * 0.7, 0, 0.1 * s, 0.25 * s, 0.3 * s);

          ctx.fill();
          ctx.stroke();

        } else {
          s = width * 0.2 * (0.4 + ll - (rim_inner_R - hub_R))
          ctx.arrow(0, 0, s * 0.7, 0, 0.1 * s, 0.25 * s, 0.3 * s);

          ctx.fill();
          ctx.stroke();
        }



        ctx.restore();

        let f = mode === "wheel_spokes_force_radius2" ? 0.2 : 0.05;
        ctx.feather(width * scale, height * scale,
          canvas.height * f, canvas.height * f,
          canvas.height * f, canvas.height * f);

      } else if (
        mode === "wheel_spokes_1" ||
        mode === "wheel_spokes_5" ||
        mode === "wheel_spokes_6" ||
        mode === "wheel_spokes_7" ||
        mode === "wheel_spokes_8") {

        let rotation_angle = 0;
        let y_translation = 0;
        let squeeze_length = slider_args[0] * 5;
        let base_l = 252.5;

        let rim_mat = ident_mat4;
        let rim_deflection = function(a, p) {
          return p;
        }

        let tension_function = function(i) {
          return 0.0;
        }

        let nipple_offset = function(i) {
          return 14;
        }

        let nipple_rotation_angle = function(i) {
          return 0;
        }


        let rim_params = {};

        if (mode === "wheel_spokes_1") {


          rotation_angle = pi / 2;
          let t = slider_args[0];

          let exp_p = t * 0.06;

          rim_params.shader = "deflect";
          rim_params.args = [exp_p, 0.1496 * exp_p, 0, 0];

          rim_deflection = function(a, p) {

            let f = Math.exp(-2 * a * a) * (-a * a + 1.0);

            p[1] *= 1.0 - f * rim_params.args[0] + rim_params.args[1];
            p[2] *= 1.0 - f * rim_params.args[0] + rim_params.args[1];

            return p;
          }

          nipple_offset = function(i) {

            let a = i * 2 * pi / 32 - pi / 2;
            let f = Math.exp(-2 * a * a) * (-a * a + 1.0);

            let k = -f * rim_params.args[0] + rim_params.args[1];

            return 14 - rim_inner_R * max(0, k);
          }

          tension_function = function(i) {
            let a = i * 2 * pi / 32 - pi / 2;
            let f = Math.exp(-2 * a * a) * (-a * a + 1.0);

            let k = -f * rim_params.args[0] + rim_params.args[1];
            return max(0, k) * 60;
          }

          y_translation = rim_deflection(0, [0, rim_outer_R, 0])[1] - rim_outer_R;

        } else if (mode === "wheel_spokes_5") {

          nipple_offset = function(i) {
            return 7 + (i == 0 || i == 16 ? 7 + squeeze_length : 0);
          }
          nipple_rotation_angle = function(i) {
            return (i == 0 || i == 16 ? squeeze_length * 2 * pi / 0.5 : 0);
          }
          tension_function = function(i) {
            return (i == 0 || i == 16 ? slider_args[0] : 0);
          }

          let sx = 1 - (rim_inner_R - squeeze_length) / rim_inner_R;
          rim_mat = scale_mat4([1, 1 - sx, 1 + sx])
        } else if (mode === "wheel_spokes_6") {

          nipple_rotation_angle = function(i) {
            return slider_args[0] * 35;
          }

          tension_function = function(i) {
            return slider_args[0];
          }
        } else if (mode === "wheel_spokes_7" || mode === "wheel_spokes_8") {
          rotation_angle = slider_args[0];

          let n = 40;
          let a = sqrt((n - 1) / 2);
          let b = sqrt((n + 1) / 2);

          let denom = 1 / (2 * n * (sinh(pi * a) * sinh(pi * a) + sin(pi * b) * sin(pi * b)));
          let A = -(a * sin(2 * pi * b) + b * sinh(2 * pi * a)) * denom;
          let B = (a * sinh(2 * pi * a) - b * sin(2 * pi * b)) * denom;
          let k = 5.7;

          let offset = mode === "wheel_spokes_7" ? 0 : 1;

          tension_function = function(i) {

            let x = rotation_angle + i * 2 * pi / n_spokes + pi;

            x = x % (2 * pi);
            if (x > pi)
              x = 2 * pi - x;


            let v = 2 * a * b / (pi * n * n);
            v += b * sinh(a * x) * cos(b * x) / n;
            v += -a * cosh(a * x) * sin(b * x) / n;
            v += A * cosh(a * x) * cos(b * x);
            v += B * sinh(a * x) * sin(b * x);

            v *= k;

            return offset + v;
          }
        }

        let mvp = mat4_mul(vp, scale_mat4(3.5));

        if (mode === "wheel_spokes_1" || mode === "wheel_spokes_8") {
          mvp = mat4_mul(mat4_mul(ortho_proj, mat3_to_mat4(rot)), scale_mat4(2.5));
        }
        mvp = mat4_mul(mvp, translation_mat4([0, y_translation, 0]));
        mvp = mat4_mul(mvp, rot_x_mat4(rotation_angle));





        gl.begin(width, height);



        let rr = rim_inner_R + 10;
        for (let i = 0; i < 32; i++) {

          let side0 = i & 1 ? -1 : 1;
          let side1 = i & 2 ? 1 : -1;


          let a = i * 2 * pi / 32;

          let p0 = [side0 * (small_hub_width / 2), cos(a) * hub_R, sin(a) * hub_R];


          let p1 = [0, cos(a) * rim_inner_R, sin(a) * rim_inner_R];
          p1 = rim_deflection(a, p1);
          p1 = mat4_mul_vec3(rim_mat, p1).slice(0, 3);

          let spoke_vector = vec_sub(p1, p0);

          a = atan2(spoke_vector[2], spoke_vector[1]);
          let l = vec_len(spoke_vector);

          let tilt = Math.asin(spoke_vector[0] / l);

          let rot_z = i & 1 ? pi : 0;

          let mat = rot_z_mat4(rot_z);
          mat = mat4_mul(rot_y_mat4(tilt), mat);
          mat = mat4_mul(rot_x_mat4(a - pi / 2), mat);
          mat = mat4_mul(translation_mat4(p0), mat);
          mat = mat4_mul(mvp, mat);

          let r = rot_z_mat3(rot_z);
          r = mat3_mul(rot_y_mat3(tilt), r);
          r = mat3_mul(rot_x_mat3(a - pi / 2), r);
          r = mat3_mul(rot, r);



          draw_spoke(mat, r, base_l);

          let base_mat = mat;
          let base_r = r;
          let nipple_angle = nipple_rotation_angle(i);


          mat = mat4_mul(mat, rot_x_mat4(pi / 2));
          mat = mat4_mul(mat, translation_mat4([0, base_l - nipple_offset(i), 0]));
          mat = mat4_mul(mat, rot_z_mat4(pi));
          mat = mat4_mul(mat, rot_y_mat4(nipple_angle));

          r = mat3_mul(r, rot_x_mat3(pi / 2));
          r = mat3_mul(r, rot_z_mat3(pi));
          r = mat3_mul(r, rot_y_mat3(nipple_angle));

          gl.draw_mesh("Nipple", mat, r);

          if (mode === "wheel_spokes_6" ||
            (mode === "wheel_spokes_5" && (i == 0 || i == 16))) {

            let m = mat;
            m = mat4_mul(m, translation_mat4([0, -5, 0]));

            gl.draw_simple_mesh("nipple_arrow", m, r, models_colors["Nipple_arrow"]);
            m = mat4_mul(m, rot_z_mat4(-pi));
            m = mat4_mul(m, rot_y_mat4(pi * 3 / 4));

            r = mat3_mul(r, rot_z_mat3(-pi));
            r = mat3_mul(r, rot_y_mat3(pi * 3 / 4));

            gl.draw_simple_mesh("nipple_arrow", m, r, models_colors["Nipple_arrow"]);
          }


          {
            let arrow_scale = tension_function(i) * 0.45;

            if (arrow_scale == 0)
              continue;

            for (let k = 0; k < 2; k++) {

              let mat = translation_mat4([0, 0, -5]);

              let ll = 1.5 * arrow_scale * 40;
              mat = mat4_mul(scale_mat4(1.5 * arrow_scale), mat);
              mat = mat4_mul(rot_x_mat4(-pi + (k ? 0 : pi)), mat);
              mat = mat4_mul(translation_mat4([0, 0, k ? 230 : 30]), mat);
              mat = mat4_mul(base_mat, mat);

              let r = rot_x_mat3(-pi + (k ? 0 : pi));
              r = mat3_mul(base_r, r);

              if (!args.has_arcball)
                mat = mat4_mul(translation_mat4([0, 0, -0.1]), mat);

              gl.draw_arrow(mat, r, force_color);
            }
          }
        }


        if (mode === "wheel_spokes_1" || mode === "wheel_spokes_7" || mode === "wheel_spokes_8") {
          let mat = rot_z_mat4(pi / 2);
          mat = mat4_mul(mat, scale_mat4([4, 70, 4]));

          let r = rot_z_mat3(pi / 2);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: [0.8, 0.8, 0.8, 1] });

        }




        draw_hub_simple(mvp, rot);
        draw_rim(mat4_mul(mvp, rim_mat), rot, rim_params);

        if (mode === "wheel_spokes_1" || mode === "wheel_spokes_7" ||
          mode === "wheel_spokes_8") {

          let ff = mode === "wheel_spokes_1" ? slider_args[0] : 0.5;
          let mat = scale_mat4(ff * 3);
          mat = mat4_mul(rot_x_mat4(-pi / 2 - rotation_angle), mat);
          mat = mat4_mul(translation_mat4([-450, 0, 0]), mat);
          mat = mat4_mul(mvp, mat);



          gl.draw_arrow(mat, rot, force2_color, 20);

        }

        ctx.drawImage(gl.finish(), 0, 0, width, height);


        {

          let mvp = mat4_mul(vp, scale_mat4(3.5));
          if (mode === "wheel_spokes_1" || mode === "wheel_spokes_8") {
            mvp = mat4_mul(mat4_mul(ortho_proj, mat3_to_mat4(rot)), scale_mat4(2.5));
          }
          mvp = mat4_mul(mvp, translation_mat4([0, y_translation, 0]));
          mvp = mat4_mul(mvp, rot_x_mat4(pi / 2));
          let p0 = project(mat4_mul_vec3(mvp, [0, 0, 0]));



          let p1 = project(mat4_mul_vec3(mvp, [0, 0, -rim_outer_R]));
          let r0 = abs(p1[1] - p0[1]);



          ctx.save();
          ctx.translate(width / 2, height / 2);

          if (mode === "wheel_spokes_1" || mode === "wheel_spokes_7" || mode === "wheel_spokes_8") {

            let d = (rotation_angle * r0);
            if (mode === "wheel_spokes_1")
              d -= width * 0.5;



            draw_ground(d, r0, width, height);

            {
              ctx.save();
              ctx.translate(-width / 2, -height / 2);

              ctx.globalCompositeOperation = "destination-over";

              let grd = ctx.createLinearGradient(0, 0, 0, height);
              grd.addColorStop(0.0, "#D1E8F5");
              grd.addColorStop(1.0, "#fff");
              ctx.fillStyle = grd;

              ctx.fillRect(0, 0, width * 2, height * 2);
              ctx.restore();
            }

            ctx.feather(width * scale, height * scale,
              canvas.height * 0.15, canvas.height * 0.15,
              canvas.height * 0.15, canvas.height * 0.15);
          }

          if (mode === "wheel_spokes_1") {
            let l = 2 * pi * r0;
            ctx.lineCap = "butt";
            ctx.setLineDash([l / 300, l / 300]);
            ctx.strokeStyle = "rgba(0,0,0,0.5)"
            ctx.translate(p0[0], p0[1]);
            ctx.strokeEllipse(0, 0, r0);
          }

          ctx.restore();
        }

      } else if (mode === "wheel_spokes_9" || mode === "wheel_spokes_10") {
        let mvp = scale_mat4(3.95);
        mvp = mat4_mul(vp, mvp);

        let hub_rotation_angle = -1;
        let nipple_rotation_angle = 0;

        if (mode === "wheel_spokes_9") {
          hub_rotation_angle = -slider_args[0];
        } else if (mode === "wheel_spokes_10") {
          hub_rotation_angle = slider_args[0] - 1;
          nipple_rotation_angle = -slider_args[0] * 15;
        }


        let hub_rot = rot_x_mat3(hub_rotation_angle);


        gl.begin(width, height);

        draw_hub(mat4_mul(mvp, mat3_to_mat4(hub_rot)), mat3_mul(rot, hub_rot));
        draw_rim(mvp, rot);


        let base_l = 295;

        for (let i = 0; i < n_spokes; i++) {

          let side0 = i & 1 ? 1 : -1;
          let side1 = i & 2 ? 1 : -1;
          let a = i * 2 * pi / n_spokes;

          let p0 = [side0 * (hub_width / 2 - side1 * side0 * spoke_knee_R), cos(a) * hub_R, sin(a) * hub_R];
          p0 = mat3_mul_vec(hub_rot, p0);

          let p1 = [0, cos(a) * rim_inner_R, sin(a) * rim_inner_R];

          let spoke_vector = vec_sub(p1, p0);

          a = atan2(spoke_vector[2], spoke_vector[1]);
          let l = vec_len(spoke_vector);

          let tilt = Math.asin(spoke_vector[0] / l);

          let mat = rot_z_mat4(i & 2 ? pi : 0);
          mat = mat4_mul(rot_y_mat4(tilt), mat);
          mat = mat4_mul(rot_x_mat4(a - pi / 2), mat);
          mat = mat4_mul(translation_mat4(p0), mat);
          mat = mat4_mul(mvp, mat);

          let r = rot_z_mat3(i & 2 ? pi : 0);
          r = mat3_mul(rot_y_mat3(tilt), r);
          r = mat3_mul(rot_x_mat3(a - pi / 2), r);
          r = mat3_mul(rot, r);

          draw_spoke(mat, r, base_l);

          if (mode === "wheel_spokes_10") {
            mat = mat4_mul(mat, rot_z_mat4(nipple_rotation_angle));
            mat = mat4_mul(mat, rot_x_mat4(pi / 2));
            mat = mat4_mul(mat, translation_mat4([0, l - 15, 0]));
            mat = mat4_mul(mat, rot_z_mat4(pi));

            r = mat3_mul(r, rot_z_mat3(nipple_rotation_angle));
            r = mat3_mul(r, rot_x_mat3(pi / 2));
            r = mat3_mul(r, rot_z_mat3(pi));

            gl.draw_mesh("Nipple", mat, r);

            let m = mat;
            m = mat4_mul(m, translation_mat4([0, -5, 0]));


            gl.draw_simple_mesh("nipple_arrow", m, r, models_colors["Nipple_arrow"]);

            m = mat4_mul(m, rot_z_mat4(-pi));
            m = mat4_mul(m, rot_y_mat4(pi * 3 / 4));

            r = mat3_mul(r, rot_z_mat3(-pi));
            r = mat3_mul(r, rot_y_mat3(pi * 3 / 4));

            gl.draw_simple_mesh("nipple_arrow", m, r, models_colors["Nipple_arrow"]);

          }

        }

        ctx.drawImage(gl.finish(), 0, 0, width, height);

      } else if (mode === "wheel_spokes_11") {
        let mvp = scale_mat4(3.95);
        mvp = mat4_mul(vp, mvp);

        let hub_rotation_angle = -1;

        let hub_rot = rot_x_mat3(hub_rotation_angle);

        gl.begin(width, height);

        draw_hub(mat4_mul(mvp, mat3_to_mat4(hub_rot)), mat3_mul(rot, hub_rot));
        draw_rim(mvp, rot);

        let base_l = 290;

        let t = slider_args[0];


        function draw_spokes(test, color) {
          for (let i = 0; i < n_spokes; i++) {

            if (!test(i))
              continue;

            let spoke_t = sharp_step(0.0 + 0.1 * i / n_spokes, 0.9 + 0.1 * i / n_spokes, t);

            let bend_t = smooth_step(0, 0.1, spoke_t) - smooth_step(0.1, 0.2, spoke_t) +
              smooth_step(0.8, 0.9, spoke_t) - smooth_step(0.9, 1.0, spoke_t);
            let vert_t = smooth_step(0.1, 0.2, spoke_t) - smooth_step(0.8, 0.9, spoke_t);
            let twist_t = smooth_step(0.3, 0.7, spoke_t);

            let active = i & 1 ? (i & 2) == 0 : (i & 2) == 2;

            let shrink = 15 * bend_t * active;

            let side0 = i & 1 ? 1 : -1;
            let side1 = i & 2 ? 1 : -1;
            let a = i * 2 * pi / n_spokes;

            let p0 = [side0 * (hub_width / 2 - side1 * side0 * spoke_knee_R), cos(a) * hub_R, sin(a) * hub_R];
            p0 = mat3_mul_vec(hub_rot, p0);

            a -= 3 / 8 * 2 * pi * twist_t * active;

            let p1 = [0, cos(a) * rim_inner_R, sin(a) * rim_inner_R];

            let spoke_vector = vec_sub(p1, p0);

            a = atan2(spoke_vector[2], spoke_vector[1]);

            let l = vec_len(spoke_vector);

            let tilt = Math.asin(spoke_vector[0] / l);

            let mat = rot_z_mat4(i & 2 ? pi : 0);
            mat = mat4_mul(rot_y_mat4(tilt), mat);


            mat = mat4_mul(rot_y_mat4(vert_t * 1 * side0 * active), mat);
            mat = mat4_mul(translation_mat4([-spoke_knee_R * vert_t * side0 * active, 0, 0]), mat);

            mat = mat4_mul(rot_x_mat4(a - pi / 2), mat);
            mat = mat4_mul(translation_mat4(p0), mat);
            mat = mat4_mul(mvp, mat);

            let r = rot_z_mat3(i & 2 ? pi : 0);
            r = mat3_mul(rot_y_mat3(tilt), r);
            r = mat3_mul(rot_x_mat3(a - pi / 2), r);
            r = mat3_mul(rot, r);

            let expected_length = base_l - shrink;

            let bend = spoke_bend(base_l, expected_length);
            let bend_a = 0.5 * hash(i);

            draw_spoke(mat, r, expected_length, [bend * cos(bend_a), bend * sin(bend_a)], true, color);
          }
        }


        let inactive_left_spokes_color = vec_scale(left_spokes_color, 0.2);
        let inactive_right_spokes_color = vec_scale(right_spokes_color, 0.2);

        draw_spokes((i) => {
          return (i & 3) == 1;
        }, left_spokes_color);

        draw_spokes((i) => {
          return (i & 3) == 2;
        }, right_spokes_color);

        if (rot[6] > 0.0) {
          draw_spokes((i) => { return (i & 3) == 0; }, inactive_right_spokes_color);
          draw_spokes((i) => { return (i & 3) == 3; }, inactive_left_spokes_color);
        } else {
          draw_spokes((i) => { return (i & 3) == 3; }, inactive_left_spokes_color);
          draw_spokes((i) => { return (i & 3) == 0; }, inactive_right_spokes_color);
        }



        ctx.drawImage(gl.finish(), 0, 0, width, height);

      } else if (mode === "wheel_spokes_12" || mode === "wheel_spokes_13" ||
        mode === "wheel_spokes_14" || mode === "wheel_spokes_15") {

        let t = slider_args[0];

        let wheel_rotation_angle = 0;

        let hub_rotation_angle = -1;

        let nipple_rotation_angle = undefined;
        let force_size;
        let spoke_colors = undefined;

        let rim_angle = 0;

        function hub_to_rim_order(i) {
          let left = (i & 1)
          let side_i = i >> 1;


          if (left) {
            if (side_i & 1)
              i = side_i * 2 + 1;
            else
              i = (side_i - 1) * 2 - 10 + 1;
          } else {
            if (side_i & 1)
              i = (side_i - 1) * 2 - 10;
            else
              i = side_i * 2;
          }
          return (i + 32) & 31;
        }

        if (mode === "wheel_spokes_12") {
          nipple_rotation_angle = t * 15;
          force_size = function(i) { return t };
        } else if (mode === "wheel_spokes_13") {
          wheel_rotation_angle = t;

          let n = 40;
          let a = sqrt((n - 1) / 2);
          let b = sqrt((n + 1) / 2);

          let denom = 1 / (2 * n * (sinh(pi * a) * sinh(pi * a) + sin(pi * b) * sin(pi * b)));
          let A = -(a * sin(2 * pi * b) + b * sinh(2 * pi * a)) * denom;
          let B = (a * sinh(2 * pi * a) - b * sin(2 * pi * b)) * denom;
          let k = 5.7;

          force_size = function(i) {


            i = hub_to_rim_order(i);

            let x = wheel_rotation_angle + i * 2 * pi / n_spokes + pi;

            x = x % (2 * pi);
            if (x > pi)
              x = 2 * pi - x;


            let v = 2 * a * b / (pi * n * n);
            v += b * sinh(a * x) * cos(b * x) / n;
            v += -a * cosh(a * x) * sin(b * x) / n;
            v += A * cosh(a * x) * cos(b * x);
            v += B * sinh(a * x) * sin(b * x);

            v *= k;

            return 1 + v;
          }
        } else if (mode === "wheel_spokes_14") {
          hub_rotation_angle += t * 0.08;

          function trailing_spoke(i) {
            let left = (i & 1)
            let side_i = i >> 1;

            if (left)
              return (side_i & 1) == 1;
            else
              return (side_i & 1) == 0;
          }

          force_size = function(i) {
            let trailing = trailing_spoke(i);

            return 1 - (trailing * 2 - 1) * 0.2 * t;
          };

          spoke_colors = function(i) {
            return trailing_spoke(i) ? left_spokes_color : right_spokes_color;
          };
        } else if (mode === "wheel_spokes_15") {

          rim_angle = t * 0.03;

          force_size = function(i) {
            i = hub_to_rim_order(i);

            let x = (i / 32 - 0.5) * 2 * pi;
            let h = 4.2 * cos(x * 1.7) / (3.1 + 2.4 * x * x)
            return 1 - h * 0.3 * t * (i & 1 ? 1 : -1);
          };

          spoke_colors = function(i) {
            return ((i & 3) == 0 || (i & 3) == 2) ? left_spokes_color : right_spokes_color;
          };
        }

        let rim_mat = rot_z_mat4(rim_angle);

        let hub_rot = rot_x_mat3(hub_rotation_angle);


        let sc = mode === "wheel_spokes_13" ? 3.5 : 4.4;

        if (mode === "wheel_spokes_15")
          sc = 3.8;

        let mvp = scale_mat4(sc);
        mvp = mat4_mul(mvp, rot_x_mat4(wheel_rotation_angle));
        mvp = mat4_mul(vp, mvp);

        let r = rot_x_mat3(wheel_rotation_angle);
        r = mat3_mul(rot, r);

        gl.begin(width, height);

        if (mode === "wheel_spokes_13") {
          let mat = rot_z_mat4(pi / 2);
          mat = mat4_mul(mat, scale_mat4([4, 70, 4]));

          let r = rot_z_mat3(pi / 2);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: [0.8, 0.8, 0.8, 1] });

        }

        draw_hub(mat4_mul(mvp, mat3_to_mat4(hub_rot)), mat3_mul(r, hub_rot));
        draw_rim(mat4_mul(mvp, rim_mat), r);
        draw_tangential_spokes(mvp, r, {
          hub_rot: hub_rot,
          nipple_arrow_rotation: nipple_rotation_angle,
          force_size: force_size,
          coloring: spoke_colors,
          rim_mat: rim_mat,
        });

        if (mode === "wheel_spokes_13") {
          let mat = rot_x_mat4(-wheel_rotation_angle - pi / 2);
          mat = mat4_mul(scale_mat4(2), mat);
          mat = mat4_mul(translation_mat4([50, 0, 0]), mat);

          r = mat3_mul(rot, rot_x_mat3(-pi / 2))

          gl.draw_arrow(mat4_mul(mvp, mat), r, force2_color);

          mat = mat4_mul(translation_mat4([-100, 0, 0]), mat);

          gl.draw_arrow(mat4_mul(mvp, mat), r, force2_color);


          let scale = 300;


          let quad_mat = mat4_mul(scale_mat4(scale), translation_mat4([0, -0.5, -0.5]));
          quad_mat = mat4_mul(rot_z_mat4(pi / 2), quad_mat);

          quad_mat = mat4_mul(translation_mat4([0, rim_outer_R, 0]), quad_mat);
          quad_mat = mat4_mul(rot_x_mat4(pi - wheel_rotation_angle), quad_mat);
          gl.draw_quad(mat4_mul(mvp, quad_mat), rot, [0.01, 0.01, 0.05, 0.20], "feather_disc");

        } else if (mode === "wheel_spokes_14") {

          let mat = rot_y_mat4(hub_rotation_angle);
          mat = mat4_mul(rot_z_mat4(-pi / 2), mat);
          mat = mat4_mul(scale_mat4(0.7), mat);
          mat = mat4_mul(translation_mat4([60, 0, 0]), mat);

          let r = rot_y_mat3(hub_rotation_angle);
          r = mat3_mul(rot_z_mat3(-pi / 2), r);

          gl.draw_mesh("Moment_arrow", mat4_mul(mvp, mat), mat3_mul(rot, r), {
            color: models_colors["Hub_simple_hole"]
          });

          mat = mat4_mul(translation_mat4([-120, 0, 0]), mat);

          gl.draw_mesh("Moment_arrow", mat4_mul(mvp, mat), mat3_mul(rot, r), {
            color: models_colors["Hub_simple_hole"]
          });
        } else if (mode === "wheel_spokes_15") {
          let arrow_mat = scale_mat4(3 * t);
          arrow_mat = mat4_mul(rot_x_mat4(pi / 2), arrow_mat);
          arrow_mat = mat4_mul(rot_z_mat4(-pi / 2 - rim_angle), arrow_mat);
          arrow_mat = mat4_mul(translation_mat4([-10, -rim_outer_R, 0]), arrow_mat);
          arrow_mat = mat4_mul(rim_mat, arrow_mat);
          arrow_mat = mat4_mul(mvp, arrow_mat);

          let arrow_rot = mat3_mul(rot_z_mat3(-pi / 2 - 0), rot_x_mat3(-pi / 2));
          arrow_rot = mat3_mul(rot, arrow_rot);


          gl.draw_arrow(arrow_mat, arrow_rot, force2_color, 10);
        }

        ctx.drawImage(gl.finish(), 0, 0, width, height);

      } else if (mode === "wheel_spokes_lat1" || mode === "wheel_spokes_lat2") {



        // x axis is wheel axis
        // y axis is up
        // z axis is 0 cause it's symmetric through xy plane

        let f = slider_args[0] * 1000;

        if (state === undefined) {
          state = {};
          state.pos = [0, 0, 0];
          state.posdot = [0, 0, 0];
          state.omega = 0.0;
          state.omegadot = 0;
        }


        const NSIM = 32;

        dt /= NSIM;
        dt *= 8;

        let hub_width = small_hub_width;

        if (mode === "wheel_spokes_lat2") {
          hub_width = 10 + slider_args[1] * 60;
        }

        let l0 = sqrt(hub_width / 2 * hub_width / 2 + (rim_inner_R - hub_R) * (rim_inner_R - hub_R)) - 3;

        let k = 1000;
        let m = 1;
        let I = 1e4;

        let force_pos = [0, -rim_outer_R, 0];

        for (let sim = 0; sim < NSIM; sim++) {

          let rim_mat = mat4_mul(translation_mat4(state.pos), rot_z_mat4(state.omega));

          let force = [f, 0, 0];
          let moment = vec_cross(force_pos, force);

          for (let i = 0; i < n_spokes; i++) {
            let a = i * 2 * pi / n_spokes;

            let p0 = [i & 1 ? hub_width / 2 : -hub_width / 2, cos(a) * hub_R, sin(a) * hub_R];
            let p1 = [0, cos(a) * rim_inner_R, sin(a) * rim_inner_R];

            p1 = mat4_mul_vec3(rim_mat, p1).slice(0, 3);

            let spoke_vector = vec_sub(p1, p0);

            let l = vec_len(spoke_vector);

            let f = -(l - l0) * k;
            let spoke_force = vec_scale(spoke_vector, f / l);
            force = vec_add(force, spoke_force);

            moment = vec_add(moment, vec_cross(p1, spoke_force));
          }

          force = vec_add(force, vec_scale(state.posdot, -3));
          moment[2] += state.omegadot * -3e4;

          state.posdot = vec_add(state.posdot, vec_scale(force, dt / m));
          state.pos = vec_add(state.pos, vec_scale(state.posdot, dt));

          state.omegadot += moment[2] * dt / I;
          state.omega += state.omegadot * dt;

          if (abs(state.omegadot) < 1e-6 &&
            abs(moment[2]) < 1e-6 &&
            vec_len(state.posdot) < 1e-6 &&
            vec_len(force) < 1e-6)
            self.set_paused(true);
        }



        let mvp = scale_mat4(3.5);
        mvp = mat4_mul(vp, mvp);


        gl.begin(width, height);

        if (mode === "wheel_spokes_lat1") {
          draw_hub_simple(mvp, rot);
        } else {

          draw_hub(mvp, rot, { width: hub_width });
        }

        let rim_mat = mat4_mul(translation_mat4(state.pos), rot_z_mat4(state.omega));
        draw_rim(mat4_mul(mvp, rim_mat), rot);

        let coloring = function(i) {
          return ((i & 3) == 0 || (i & 3) == 2) ? left_spokes_color : right_spokes_color;
        }

        if (mode === "wheel_spokes_lat1") {
          coloring = function(i) {
            return i == 15 ? left_spokes_color : (i == 16 ? right_spokes_color : models_colors["Spoke"]);
          }
        }

        draw_radial_spokes(mvp, rot, { rim_mat: rim_mat, hub_width: hub_width, flip: (mode === "wheel_spokes_lat1"), coloring: coloring });


        let arrow_mat = scale_mat4(4 * slider_args[0]);
        arrow_mat = mat4_mul(rot_x_mat4(pi / 2), arrow_mat);
        arrow_mat = mat4_mul(rot_z_mat4(-pi / 2 - state.omega), arrow_mat);
        arrow_mat = mat4_mul(translation_mat4([-10, force_pos[1], 0]), arrow_mat);
        arrow_mat = mat4_mul(rim_mat, arrow_mat);
        arrow_mat = mat4_mul(mvp, arrow_mat);

        let arrow_rot = mat3_mul(rot_z_mat3(-pi / 2 - state.omega), rot_x_mat3(-pi / 2));
        arrow_rot = mat3_mul(rot, arrow_rot);


        gl.draw_arrow(arrow_mat, arrow_rot, force2_color, 10);

        let quad_mat = mat4_mul(scale_mat4(750), translation_mat4([0, -0.5, -0.5]));
        gl.draw_quad(mat4_mul(mvp, quad_mat), rot, [0.01, 0.01, 0.05, 0.2], "feather_disc");

        ctx.drawImage(gl.finish(), 0, 0, width, height);

      } else if (mode === "spoke_buckling") {

        let s = width * 2.5;

        let l = 0.3;
        let r = 0.0005;

        let f = slider_args[0];

        let e = tan(f * 0.05 * pi / 2);
        e = e * e;
        let ll = l * (1 - e);

        let h = spoke_bend(l, ll, true);

        ctx.translate(width / 2, height / 2);

        ctx.lineCap = "square";
        ctx.lineWidth = r * s * 2 + 2;
        ctx.strokeStyle = "#333";

        ctx.beginPath();
        let n = 32;
        for (let i = 0; i <= n; i++) {
          let t = i / n;

          ctx.lineTo((t - 0.5) * ll * s, -s * h * sin(t * pi));
        }
        ctx.stroke();

        ctx.lineWidth = r * s * 2;

        ctx.strokeStyle = "#888";
        ctx.stroke();

        let ss = s * 0.01 * (f);
        ctx.lineWidth = 1.5;
        ctx.fillStyle = force_color_css[0];
        ctx.strokeStyle = force_color_css[1];

        ctx.arrow(-ll * s / 2 - ss * 4 - s * 0.002, 0,
          -ll * s / 2 - s * 0.002, 0,
          ss * 0.4, ss, ss * 1.3);
        ctx.fill();
        ctx.stroke();

        ctx.arrow(+ll * s / 2 + ss * 4 + s * 0.002, 0,
          +ll * s / 2 + s * 0.002, 0,
          ss * 0.4, ss, ss * 1.3);
        ctx.fill();
        ctx.stroke();

      } else if (mode === "spoke_pushing" || mode === "spoke_pulling") {

        let s = width * 2.5;

        let l = 0.3;
        let r = 0.0007 + 0.001 * slider_args[1] * slider_args[1];
        let E = 200e9;
        let f = slider_args[0] * 300;

        if (mode === "spoke_pushing") {
          E = 13e9;
          f = -slider_args[0] * 3000;
          l = 0.1;
          r = 0.007 + 0.007 * slider_args[1] * slider_args[1];
        }


        let A = pi * r * r;
        let sig = f / A;
        let e = sig / E;
        let v = 0.27;
        r *= (1 - e * v);
        let ll = l * (1 + e);

        let h = spoke_bend(l, ll, true);

        if (mode === "spoke_pushing")
          ctx.translate(round(width / 2), round(height * 0.2));
        else
          ctx.translate(round(width / 2), round(height * 0.15));

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#333";

        if (mode === "spoke_pushing") {
          ctx.strokeStyle = "#5E4F41";
        }

        let grd = ctx.createLinearGradient(0, -r * s, 0, r * s);

        let n = 15;
        for (let i = 0; i <= n; i++) {
          let t = i / n;
          let a = t * pi + 0.1;
          let c = sqrt(abs(sin(a)));
          let dim = lerp(1.0, c, 0.7);
          let color = [180 / 255, 180 / 255, 180 / 255, 1 / dim];

          if (mode === "spoke_pushing") {

            dim = lerp(1.0, c, 0.25);
            color = [206 / 255, 176 / 255, 145 / 255, 1 / dim];
          }

          grd.addColorStop(t, rgba_color_string(vec_scale(color, dim)));
        }

        ctx.fillStyle = grd;

        ctx.beginPath();
        ctx.rect(-ll * s * 0.5, -r * s, ll * s, r * s * 2);
        ctx.fill();
        ctx.stroke();




        let ss = s * abs(f) * (mode === "spoke_pushing" ? 6e-6 : 0.000035);
        ctx.lineWidth = 1;
        ctx.lineCap = "butt";

        ctx.lineWidth = 1.5;
        ctx.fillStyle = force_color_css[0];
        ctx.strokeStyle = force_color_css[1];

        let p = mode === "spoke_pushing" ? 1 : 0;

        ctx.arrow(-ll * s / 2 - s * 0.005 - ss * 4 * p, 0,
          -ll * s / 2 - s * 0.005 - ss * 4 * (1 - p), 0,
          ss * 0.4, ss, ss * 1.3);
        ctx.fill();
        ctx.stroke();

        ctx.arrow(+ll * s / 2 + s * 0.005 + ss * 4 * p, 0,
          +ll * s / 2 + s * 0.005 + ss * 4 * (1 - p), 0,
          ss * 0.4, ss, ss * 1.3);
        ctx.fill();
        ctx.stroke();

        let scale = 60;
        let rr = round(height * 0.3);

        {
          ctx.save();

          let text = "σ = ";
          let text2 = " = " + sigma_string(mode === "spoke_pushing" ? 5e6 : 200e6);

          let text3 = " = " + sigma_string(abs(sig));

          let w0 = ctx.measureText(text).width;
          let w2 = ctx.measureText(text2).width;
          let ww = ceil(width * (mode === "spoke_pushing" ? 0.08 : 0.05));

          let total_w = w0 + w2 + ww;

          ctx.translate(-total_w / 2, ceil(height * 0.5));

          ctx.fillStyle = "#333";
          ctx.strokeStyle = "#333";
          ctx.textAlign = "left";
          ctx.fillText(text, 0, 0);
          ctx.fillText(text3, w0 + ww, 0);

          let y = -font_size * 0.3;

          ctx.translate(w0, y);

          ctx.lineWidth = 2;

          ctx.strokeLine(0, 0, ww, 0);
          ctx.lineWidth = 1.5;

          ctx.fillStyle = force_color_css[0];
          ctx.strokeStyle = force_color_css[1];

          ss *= 0.4;
          ctx.arrow(ww / 2 + ss * 4 * p - ss * 2, -width * 0.02,
            ww / 2 + ss * 4 * (1 - p) - ss * 2, -width * 0.02,
            ss * 0.4, ss, ss * 1.3);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = mode === "spoke_pushing" ? "#CEB091" : "#ccc";
          ctx.strokeStyle = mode === "spoke_pushing" ? "#5E4F41" : "#333";

          ctx.fillEllipse(ww / 2, width * 0.01 + r * s, r * s);
          ctx.strokeEllipse(ww / 2, width * 0.01 + r * s, r * s);

          ctx.restore();
        }


        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#333";
        if (mode === "spoke_pushing") {
          ctx.strokeStyle = "#5E4F41";
        }



        for (let i = 0; i < 2; i++) {
          let sign = i ? 1 : -1;
          let p0 = [sign * round(l * s * 0.5), round(height * 0.5)];

          if (mode === "spoke_pushing") {
            p0 = [sign * round(width * 0.35), round(height * 0.4)];
          }

          ctx.save();
          ctx.beginPath();
          ctx.translate(p0[0], p0[1]);
          ctx.rect(-rr, -rr, 2 * rr, 2 * rr);
          ctx.clip();

          let grd = ctx.createLinearGradient(0, -r * s * scale, 0, r * s * scale);

          let n = 15;
          for (let i = 0; i <= n; i++) {
            let t = i / n;
            let a = t * pi + 0.1;
            let c = sqrt(abs(sin(a)));
            let dim = lerp(1.0, c, 0.1);
            let color = [180 / 255, 180 / 255, 180 / 255, 1 / dim];
            if (mode === "spoke_pushing") {

              dim = lerp(1.0, c, 0.1);
              color = [206 / 255, 176 / 255, 145 / 255, 1 / dim];
            }

            grd.addColorStop(t, rgba_color_string(vec_scale(color, dim)));
          }

          ctx.fillStyle = grd;
          ctx.scale(sign, 1);

          ctx.beginPath();
          ctx.rect(-width, -r * s * scale, width + l * s * e * 0.5 * scale, r * s * 2 * scale);
          ctx.fill();
          ctx.stroke();

          let ll = r * s * scale + height * 0.05;
          ctx.setLineDash([1, 2])
          ctx.strokeStyle = "rgba(0,0,0,0.4)"
          ctx.strokeLine(0, -ll,
            0, ll);

          ctx.globalCompositeOperation = "destination-in";
          ctx.fillEllipse(0, 0, rr);

          ctx.restore();


          draw_zoom(rr, rr / scale, p0, [sign * l * s / 2, 0]);
        }

      } else if (mode === "wheel_spokes_lat_length") {
        let mvp = mat4_mul(scale_mat4(5), translation_mat4([36, -160, 0]));

        mvp = mat4_mul(mat4_mul(ortho_proj, mat3_to_mat4(rot)), mvp);

        let pos = [0, 0, 0];
        let omega = -slider_args[0] * 0.08;

        let hub_width = 10 + slider_args[1] * 60;

        let rim_mat = rot_x_mat4(-3 * pi / 32);

        rim_mat = mat4_mul(rot_z_mat4(omega), rim_mat);
        rim_mat = mat4_mul(rot_x_mat4(3 * pi / 32), rim_mat);
        rim_mat = mat4_mul(translation_mat4(pos), rim_mat);

        let rim_a = 0.04;
        let rim_color = vec_scale(models_colors["Rim"], rim_a);

        gl.begin(width, height);
        draw_hub(mvp, rot, { width: hub_width });


        let spokes_options = {
          rim_mat: rim_mat,
          hub_width: hub_width,
          draw_count: 2,
        };

        let base_length; {
          let a = 2 * pi / 32;
          let p0 = [(hub_width / 2 + spoke_knee_R), cos(a) * hub_R, sin(a) * hub_R];

          let rim_mat = rot_x_mat4(-3 * pi / 32);

          rim_mat = mat4_mul(rot_x_mat4(3 * pi / 32), rim_mat);
          rim_mat = mat4_mul(translation_mat4(pos), rim_mat);


          let p1 = [0, cos(a) * rim_inner_R, sin(a) * rim_inner_R];
          p1 = mat4_mul_vec3(rim_mat, p1).slice(0, 3);

          let spoke_vector = vec_sub(p1, p0);

          a = atan2(spoke_vector[2], spoke_vector[1]);
          base_length = vec_len(spoke_vector) - 0.5;
        }

        let lengths = [];

        for (let i = 1; i < 3; i++) {

          let side0 = i & 1 ? 1 : -1;
          let side1 = i & 2 ? 1 : -1;

          let a = i * 2 * pi / 32;

          let p0 = [side0 * (hub_width / 2 - side1 * side0 * spoke_knee_R), cos(a) * hub_R, sin(a) * hub_R];

          let p1 = [0, cos(a) * rim_inner_R, sin(a) * rim_inner_R];
          p1 = mat4_mul_vec3(rim_mat, p1).slice(0, 3);

          let spoke_vector = vec_sub(p1, p0);

          a = atan2(spoke_vector[2], spoke_vector[1]);
          let l = vec_len(spoke_vector);

          lengths.push(l);

          let tilt = Math.asin(spoke_vector[0] / l);

          let rot_z = i & 2 ? pi : 0;

          let mat = rot_z_mat4(rot_z);
          mat = mat4_mul(rot_y_mat4(tilt), mat);
          mat = mat4_mul(rot_x_mat4(a - pi / 2), mat);
          mat = mat4_mul(translation_mat4(p0), mat);
          mat = mat4_mul(mvp, mat);

          let r = rot_z_mat3(rot_z);
          r = mat3_mul(rot_y_mat3(tilt), r);
          r = mat3_mul(rot_x_mat3(a - pi / 2), r);
          r = mat3_mul(rot, r);


          draw_spoke(mat, r, l, undefined, true, i == 2 ? left_spokes_color : right_spokes_color);


          let arrow_size = (0.35 + (l - base_length) * 0.1) * 0.8;
          if (arrow_size) {
            let mmat = mat;

            mmat = mat4_mul(mmat, rot_z_mat4(pi / 2));
            mmat = mat4_mul(mmat, translation_mat4([0, 0, 110]));
            gl.draw_arrow(mat4_mul(mmat, scale_mat4(arrow_size)), mat3_mul(r, rot_z_mat3(pi / 2)));
          }



          mat = mat4_mul(mat, rot_x_mat4(pi / 2));
          mat = mat4_mul(mat, translation_mat4([0, l - 14, 0]));
          mat = mat4_mul(mat, rot_z_mat4(pi));

          r = mat3_mul(r, rot_x_mat3(pi / 2));
          r = mat3_mul(r, rot_z_mat3(pi));

          gl.draw_mesh("Nipple", mat, r, { color: rim_color });

        }




        let scale = 7;

        function draw_flat_spokes(mat) {
          let r = mat3_mul(rot_x_mat3(pi / 2), rot_y_mat3(pi / 2));

          let mvp = mat4_mul(mat4_mul(ortho_proj, mat3_to_mat4(r)), scale_mat4(5));

          mvp = mat4_mul(mat, mvp);
          mvp = mat4_mul(mvp, translation_mat4([2, 0, 0]));


          r = mat3_mul(rot_x_mat3(1.4), rot_y_mat3(1.5));



          draw_spoke(mat4_mul(mvp, rot_z_mat4(pi)), r, lengths[0], undefined, true, right_spokes_color);

          mvp = mat4_mul(mvp, translation_mat4([-4, 0, 0]));
          draw_spoke(mvp, r, lengths[1], undefined, true, left_spokes_color);
        }

        draw_flat_spokes(translation_mat4([-0.9, -0.75, 0]));

        let p0 = [round(width * 0.38), round(width * 0.08)];
        let p1;


        {
          let mvp = mat4_mul(ortho_proj, scale_mat4(5));
          mvp = mat4_mul(translation_mat4([-0.9, -0.75, 0]), mvp);
          p1 = project(mat4_mul_vec3(mvp, [base_length - 0.5, 0, 0])).slice(0, 2);
        }

        let rr = round(height * 0.28 - 3);


        let zoom_mat = translation_mat4([-base_length / 200, 0, 0]);
        zoom_mat = mat4_mul(scale_mat4(scale), zoom_mat);
        zoom_mat = mat4_mul(translation_mat4([2 * p0[0] / width, -2 * p0[1] / height, 0]), zoom_mat);


        gl.scissors(round(width * 0.5) + p0[0] - rr, 0, rr * 2, rr * 2);
        draw_flat_spokes(zoom_mat);

        gl.scissors(0, 0, width, height);
        draw_rim(mat4_mul(mvp, rim_mat), rot, { color: rim_color });


        ctx.drawImage(gl.finish(), 0, 0, width, height);



        ctx.translate(round(width * 0.5), round(height * 0.5));

        ctx.save();
        ctx.beginPath();
        ctx.translate(p0[0], p0[1]);
        ctx.rect(-rr, -rr, 2 * rr, 2 * rr);
        ctx.clip();


        ctx.globalCompositeOperation = "destination-in";
        ctx.fillEllipse(0, 0, rr);

        ctx.restore();

        draw_zoom(rr, rr / scale, p0, p1);

        ctx.feather(width * scale, height * scale,
          canvas.height * 0.15, 0, 0, 0);


      } else if (mode === "wheel1") {

        let n_ang = 128;
        let n_rad = 32;
        let n = 2 * n_ang * n_rad;
        let n_conn = (n_ang * n_rad + n_ang * (n_rad - 1) + (n_rad - 1) * (n_ang) * 2)

        function index(ang, rad) {
          return ang * n_rad + rad;
        }


        if (state === undefined) {



          state = {};

          state.positions = new Float32Array(n);
          state.velocities = new Float32Array(n);
          state.forces = new Float32Array(n);

          state.connections = new Int16Array(2 * n_conn);

          state.connections_inv_l = new Float32Array(n_conn);
          state.spring_forces = new Float32Array(n_conn);


          function reject(ang, rad) {
            return (rad < n_rad - 10)
          }



          for (let i = 0; i < n_ang; i++) {
            let a = i * 2 * pi / n_ang;
            let c = cos(a);
            let s = sin(a);
            for (let j = 0; j < n_rad; j++) {
              let r = 0.1 + 0.9 * j / (n_rad - 1);

              let ind = index(i, j) * 2;
              state.positions[ind + 0] = r * s;
              state.positions[ind + 1] = r * c;
            }
          }

          let k = 0;

          for (let i = 0; i < n_ang; i++) {
            for (let j = 0; j < n_rad - 1; j++) {

              if (reject(i, j))
                continue;

              state.connections[k++] = index(i, j);
              state.connections[k++] = index(i, j + 1);
            }
          }

          for (let i = 0; i < n_ang; i++) {
            for (let j = 0; j < n_rad; j++) {

              if (reject(i, j))
                continue;

              state.connections[k++] = index(i, j);
              state.connections[k++] = index((i + 1) % n_ang, j);

            }
          }

          for (let i = 0; i < n_ang; i++) {
            for (let j = 0; j < n_rad - 1; j++) {


              if (reject(i, j))
                continue;

              state.connections[k++] = index(i, j);
              state.connections[k++] = index((i + 1) % n_ang, (j + 1) % n_rad);

              state.connections[k++] = index((i + 1) % n_ang, j);
              state.connections[k++] = index(i, (j + 1) % n_rad);
            }
          }


          state.n_connections = k;
          // lengths



          for (let i = 0; i < state.n_connections; i += 2) {

            state.connections_inv_l[i >> 1] = 1 / vec_len(direction(i, state.positions, state.connections));
          }
        }

        function direction(i, positions, connections) {
          return [positions[connections[i + 0] * 2] -
            positions[connections[i + 1] * 2],
            positions[connections[i + 0] * 2 + 1] -
            positions[connections[i + 1] * 2 + 1]
          ];
        }

        // sim

        const k = 500;

        const NSIM = 64;

        dt /= NSIM;
        dt *= 3;

        for (let sim = 0; sim < NSIM; sim++) {

          // forward

          for (let i = 0; i <= n_ang / 2; i++) {
            let t = pi * i / (n_ang / 2);
            let f = sin(t);
            state.forces[index((i + n_ang * 3 / 4) % n_ang, 0) * 2 + 1] = 15 * f;
          }


          for (let i = 0; i < state.n_connections; i += 2) {

            let i0 = state.connections[i + 0];
            let i1 = state.connections[i + 1];

            let dir = direction(i, state.positions, state.connections);

            let l = vec_len(dir);

            let f = -k * (l * state.connections_inv_l[i >> 1] - 1.0);

            let fx = dir[0] * f / l;
            let fy = dir[1] * f / l;

            state.spring_forces[i >> 1] = f;

            state.forces[i0 * 2 + 0] += fx;
            state.forces[i0 * 2 + 1] += fy;
            state.forces[i1 * 2 + 0] -= fx;
            state.forces[i1 * 2 + 1] -= fy;
          }

          for (let i = 0; i < n; i++) {
            state.velocities[i] = state.velocities[i] + state.forces[i] * dt;
            state.velocities[i] *= 0.9;
            state.positions[i] = state.positions[i] + state.velocities[i] * dt;
            state.forces[i] = 0;
          }

          // constraints


          for (let i = 0; i < n; i += 2) {

            state.positions[i + 1] = min(state.positions[i + 1], 1)
          }

        }

        // draw



        let sc = width * 0.4;
        ctx.translate(width / 2, height / 2);

        ctx.scale(sc, sc);
        ctx.strokeStyle = "rgba(0,0,0,0.5)"
        ctx.lineWidth = 1 / sc;

        for (let i = 0; i < state.n_connections; i += 2) {
          let f = state.spring_forces[i >> 1];

          ctx.strokeStyle = f > 0 ? "red" : "blue";
          ctx.globalAlpha = abs(f * 0.1);
          ctx.strokeLine(state.positions[state.connections[i + 0] * 2],
            state.positions[state.connections[i + 0] * 2 + 1],
            state.positions[state.connections[i + 1] * 2],
            state.positions[state.connections[i + 1] * 2 + 1],
          )
        }

        ctx.globalAlpha = 0.2;

        for (let i = 0; i < state.positions.length; i += 2) {
          ctx.fillEllipse(state.positions[i], state.positions[i + 1], 1 / sc);
        }

      } else if (mode === "bike_frame") {
        let mvp = mat4_mul(vp, scale_mat4(4.1));
        mvp = mat4_mul(mvp, translation_mat4([-400, -200, 0]));
        gl.begin(width, height);

        draw_bike(mvp, rot, { frame_only: true });

        mvp = mat4_mul(mvp, translation_mat4(sprocket));

        ctx.drawImage(gl.finish(), 0, 0, width, height);
        ctx.feather(width * scale, height * scale,
          0, 0, canvas.height * 0.1, canvas.height * 0.1);
      } else if (mode === "bike_frame2") {

        let mvp = mat4_mul(vp, scale_mat4(2.5));
        mvp = mat4_mul(mvp, translation_mat4([-front[0] / 2, -100, 0]));
        gl.begin(width, height);

        draw_bike(mvp, rot);


        let alpha = 0.85;
        let sc = 70;

        let objs = [
          [mat4_mul(mvp, mat4_mul(translation_mat4(seat), scale_mat4(sc))), force_color],
          [mat4_mul(mvp, mat4_mul(translation_mat4(vec_add(rear, [0, 0, rear_dropout_width / 2])), scale_mat4(sc * 0.6))), force4_color],
          [mat4_mul(mvp, mat4_mul(translation_mat4(vec_add(rear, [0, 0, -rear_dropout_width / 2])), scale_mat4(sc * 0.6))), force4_color],
          [mat4_mul(mvp, mat4_mul(translation_mat4(sprocket), scale_mat4(sc))), force2_color],
          [mat4_mul(mvp, mat4_mul(translation_mat4(front_up), scale_mat4(sc * 0.6))), force6_color],
          [mat4_mul(mvp, mat4_mul(translation_mat4(front_down), scale_mat4(sc * 0.6))), force6_color]
        ];

        objs.sort((a, b) => {
          let pa = mat4_mul_vec4(a[0], [0, 0, 0, 1]);
          let pb = mat4_mul_vec4(b[0], [0, 0, 0, 1]);
          return -pa[2] / pa[3] + pb[2] / pb[3];
        });

        for (let obj of objs)
          gl.draw_simple_mesh("sphere", obj[0], rot, vec_scale(obj[1], alpha));


        ctx.drawImage(gl.finish(), 0, 0, width, height);
        ctx.feather(width * scale, height * scale,
          0, 0, canvas.height * 0.1, canvas.height * 0.1);
      } else if (mode === "bike_frame3") {

        let mvp = mat4_mul(vp, scale_mat4(3.6));
        mvp = mat4_mul(mvp, translation_mat4([-400, -210, 0]));
        gl.begin(width, height);

        mvp = mat4_mul(scale_mat4(0.5), mvp);

        let skips = [
          [
            0, 1, 6, 18, 19, 20, 21, 23
          ],
          [
            0, 1, 8, 18, 19, 20, 21, 23
          ],
          [
            0, 1, 8, 4, 5, 12, 18, 23
          ],
          [
            4, 5, 8, 18, 19, 20, 21, 23
          ]
        ];

        for (let i = 0; i < 4; i++) {
          let mat = mat4_mul(translation_mat4([(i & 1) - 0.5, ((i >> 1) & 1) - 0.5, 0]), mvp);
          draw_bike(mat, rot, { frame_only: true, skipped_link_indices: skips[i] });
        }




        ctx.drawImage(gl.finish(), 0, 0, width, height);
        ctx.feather(width * scale, height * scale,
          0, 0, canvas.height * 0.1, canvas.height * 0.1);
      } else if (mode === "bike_pedal" || mode === "bike_pedal2" || mode === "bike_pedal3") {

        let t = slider_args[0];

        let h = 1 / 6;



        let crank_angle = 1.5 + t * 0.05;
        let mvp = mat4_mul(vp, scale_mat4(4));
        mvp = mat4_mul(mvp, translation_mat4([-280, 80, 0]));

        if (mode === "bike_pedal2") {
          mvp = mat4_mul(ortho_proj, scale_mat4(5));
          mvp = mat4_mul(mvp, translation_mat4(vec_neg(sprocket)));
          rot = ident_mat3;
        } else if (mode === "bike_pedal3") {
          mvp = mat4_mul(ortho_proj, scale_mat4(3));
          mvp = mat4_mul(mvp, translation_mat4([-230, 50, 0]));
          rot = ident_mat3;
        }
        gl.begin(width, height);

        draw_bike(mvp, rot, {
          crank_angle: crank_angle,
          rear_wheel_angle: crank_angle * gear_ratio
        });


        let d = vec_sub(sprocket, rear);

        let rear_a = atan2(d[1], d[0]);

        {
          let R = front_sprocket_R;
          let r = rear_sprocket_R;

          let ll = sqrt(vec_len_sq(d) - (R - r) * (R - r));
          rear_a += atan2(R - r, ll);
        }



        if (mode === "bike_pedal") {
          let base_scale = 2; {
            let mat = scale_mat4(base_scale);
            mat = mat4_mul(rot_y_mat4(pi / 2), mat);
            mat = mat4_mul(rot_z_mat4(pi / 2 + crank_angle), mat);
            mat = mat4_mul(translation_mat4([0, crank_length, 100]), mat);
            mat = mat4_mul(rot_z_mat4(-crank_angle), mat);
            mat = mat4_mul(translation_mat4(sprocket), mat);

            let r = ident_mat3;
            r = mat3_mul(rot_y_mat3(pi / 2), r);
            r = mat3_mul(rot_z_mat3(pi / 2), r);
            gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force_color, 10);
          }

          {
            let mat = scale_mat4(0.8 * base_scale * crank_length / front_sprocket_R);
            mat = mat4_mul(rot_x_mat4(-pi / 2), mat);
            mat = mat4_mul(rot_z_mat4(3 - crank_angle), mat);
            mat = mat4_mul(translation_mat4(sprocket), mat);
            mat = mat4_mul(translation_mat4([0, 0, 90]), mat);

            let r = ident_mat3;
            r = mat3_mul(rot_x_mat3(-pi / 2), r);
            r = mat3_mul(rot_z_mat3(3 - crank_angle), r);

            gl.draw_mesh("Moment_arrow", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: force4_color });

          }


          {
            let mat = scale_mat4(base_scale * crank_length / front_sprocket_R);
            mat = mat4_mul(rot_y_mat4(-pi / 2), mat);
            mat = mat4_mul(rot_z_mat4(rear_a), mat);
            mat = mat4_mul(translation_mat4(rear), mat);
            mat = mat4_mul(translation_mat4([300, 29, 45]), mat);

            let r = ident_mat3;
            r = mat3_mul(rot_y_mat3(-pi / 2), r);
            gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force6_color, 10);
          }

          {
            let mat = scale_mat4(0.8 * base_scale * crank_length / front_sprocket_R / gear_ratio);
            mat = mat4_mul(rot_x_mat4(-pi / 2), mat);
            mat = mat4_mul(rot_z_mat4(0 - crank_angle * gear_ratio), mat);
            mat = mat4_mul(translation_mat4(rear), mat);
            mat = mat4_mul(translation_mat4([0, 0, 70]), mat);

            let r = ident_mat3;
            r = mat3_mul(rot_x_mat3(-pi / 2), r);
            r = mat3_mul(rot_z_mat3(3 - crank_angle), r);

            gl.draw_mesh("Moment_arrow", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: force1_color });

          }

          {
            let mat = scale_mat4(base_scale * crank_length / front_sprocket_R * rear_sprocket_R / tire_outer_R);
            mat = mat4_mul(rot_y_mat4(pi / 2), mat);
            mat = mat4_mul(translation_mat4(rear), mat);
            mat = mat4_mul(translation_mat4([-40, -tire_outer_R, 0]), mat);

            let r = ident_mat3;
            r = mat3_mul(rot_y_mat3(-pi / 2), r);
            gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force2_color, 10);
          }
        }


        if (mode !== "bike_pedal")
          ctx.globalAlpha = 0.5;

        ctx.drawImage(gl.finish(), 0, 0, width, height);
        ctx.globalAlpha = 1;

        ctx.translate(width / 2, height / 2);


        if (mode === "bike_pedal2") {

          let pp1 = [crank_length * sin(crank_angle), crank_length * cos(crank_angle), 0];

          let pp2 = [front_sprocket_R * sin(crank_angle + pi),
            front_sprocket_R * cos(crank_angle + pi), 0
          ];

          let pp3 = [0, front_sprocket_R, 0];

          let p0 = project(mat4_mul_vec3(mvp, sprocket));
          let p1 = project(mat4_mul_vec3(mvp, vec_add(sprocket, pp1)));
          let p2 = project(mat4_mul_vec3(mvp, vec_add(sprocket, pp2)));
          let p3 = project(mat4_mul_vec3(mvp, vec_add(sprocket, pp3)));

          let dd = vec_sub(p2, p0);
          let dir = vec_norm(dd);

          ctx.lineWidth = width * 0.017;
          ctx.strokeStyle = force4_color_css[1];
          ctx.strokeLine(p0[0], p0[1], p1[0], p1[1]);
          ctx.strokeStyle = force5_color_css[1];
          ctx.strokeLine(p0[0], p0[1], p2[0], p2[1]);

          ctx.lineWidth = width * 0.01;
          ctx.strokeStyle = force4_color_css[0];
          ctx.strokeLine(p0[0], p0[1], p1[0], p1[1]);
          ctx.strokeStyle = force5_color_css[0];
          ctx.strokeLine(p0[0], p0[1], p2[0], p2[1]);

          ctx.fillStyle = "#222";
          ctx.fillEllipse(p0[0], p0[1], width * 0.01);

          ctx.lineWidth = width * 0.003;
          let ss = width * 0.15;
          let r = crank_length / front_sprocket_R;

          ctx.fillStyle = force_color_css[0];
          ctx.strokeStyle = force_color_css[1];
          ctx.arrow(p1[0] - dir[1] * ss, p1[1] + dir[0] * ss, p1[0], p1[1], 0.2 * ss, 0.5 * ss, 0.6 * ss);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = force1_color_css[0];
          ctx.strokeStyle = force1_color_css[1];
          ctx.arrow(p2[0] + dir[1] * ss * r, p2[1] - dir[0] * ss * r, p2[0], p2[1], 0.2 * ss, 0.5 * ss, 0.6 * ss);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = force6_color_css[0];
          ctx.strokeStyle = force6_color_css[1];
          ctx.arrow(p3[0] - ss * r * cos(-rear_a),
            p3[1] - ss * r * sin(-rear_a),
            p3[0], p3[1], 0.2 * ss, 0.5 * ss, 0.6 * ss);
          ctx.fill();
          ctx.stroke();

        } else if (mode === "bike_pedal3") {


          let pp1 = [front_sprocket_R * sin(-rear_a),
            front_sprocket_R * cos(-rear_a), 0
          ];

          let pp3 = [rear_sprocket_R * sin(-rear_a),
            rear_sprocket_R * cos(-rear_a), 0
          ];

          let p0 = project(mat4_mul_vec3(mvp, sprocket));
          let p1 = project(mat4_mul_vec3(mvp, vec_add(sprocket, pp1)));
          let p2 = project(mat4_mul_vec3(mvp, rear));
          let p3 = project(mat4_mul_vec3(mvp, vec_add(rear, pp3)));


          ctx.lineWidth = width * 0.017;
          ctx.strokeStyle = force5_color_css[1];
          ctx.strokeLine(p0[0], p0[1], p1[0], p1[1]);
          ctx.strokeStyle = force3_color_css[1];
          ctx.strokeLine(p3[0], p3[1], p2[0], p2[1]);

          ctx.lineWidth = width * 0.01;
          ctx.strokeStyle = force5_color_css[0];
          ctx.strokeLine(p0[0], p0[1], p1[0], p1[1]);
          ctx.strokeStyle = force3_color_css[0];
          ctx.strokeLine(p3[0], p3[1], p2[0], p2[1]);

          let ss = width * 0.14;

          ctx.lineWidth = width * 0.003;


          ctx.fillStyle = force6_color_css[0];
          ctx.strokeStyle = force6_color_css[1];

          ctx.arrow(p1[0],
            p1[1],
            p1[0] + ss * 1.5 * cos(-rear_a),
            p1[1] + ss * 1.5 * sin(-rear_a),
            0.2 * ss, 0.5 * ss, 0.6 * ss);
          ctx.fill();
          ctx.stroke();

          ctx.arrow(p3[0],
            p3[1],
            p3[0] + ss * 1.5 * cos(-rear_a),
            p3[1] + ss * 1.5 * sin(-rear_a),
            0.2 * ss, 0.5 * ss, 0.6 * ss);
          ctx.fill();
          ctx.stroke();

          function draw_arc_arrow(p, size, rot) {
            ctx.save();
            ctx.translate(p[0], p[1]);
            ctx.scale(-size, size);
            ctx.rotate(rot);
            ctx.lineWidth = 1.5 / size;
            let r = 15;
            let w = 5;
            ctx.beginPath();
            ctx.arc(0, 0, r + w / 2, Math.PI * 1.5, Math.PI * 0.5, true);
            ctx.lineTo(0, r + 6);
            ctx.lineTo(13, r);
            ctx.lineTo(0, r - 6);
            ctx.arc(0, 0, r - w / 2, Math.PI * 0.5, Math.PI * 1.5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          }

          ctx.strokeStyle = force4_color_css[1];
          ctx.fillStyle = force4_color_css[0];
          draw_arc_arrow(p0, width * 0.004, 1 - crank_angle);

          ctx.strokeStyle = force1_color_css[1];
          ctx.fillStyle = force1_color_css[0];
          draw_arc_arrow(p2, width * 0.004 / gear_ratio, 3.4 - crank_angle * gear_ratio);

          ctx.fillStyle = "#222";
          ctx.fillEllipse(p0[0], p0[1], width * 0.004);
          ctx.fillEllipse(p2[0], p2[1], width * 0.004);
        }

        ctx.feather(width * scale, height * scale,
          canvas.height * 0.1, canvas.height * 0.1,
          canvas.height * 0.1, canvas.height * 0.1);
      } else if (mode === "bike_brake") {

        let t = slider_args[0];

        let a = slider_args[0] * -0.42;

        let mvp = mat4_mul(vp, scale_mat4(6));
        mvp = mat4_mul(mvp, translation_mat4([-880, -400, 0]));

        gl.begin(width, height);

        draw_bike(mvp, rot, {
          brake_angles: [a, 0]
        });



        let base_scale = 0.4 * slider_args[0]; {
          let mat = scale_mat4(base_scale);
          mat = mat4_mul(rot_y_mat4(pi / 2), mat);
          mat = mat4_mul(translation_mat4([1055 + sin(a) * 64, 450, -210]), mat);

          let r = ident_mat3;
          r = mat3_mul(rot_y_mat3(pi / 2), r);
          gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force1_color, 10);
        }

        {
          let mat = scale_mat4(base_scale * 3);
          mat = mat4_mul(rot_y_mat4(pi / 2), mat);
          mat = mat4_mul(rot_z_mat4(pi), mat);
          mat = mat4_mul(translation_mat4([1065 - sin(a) * 185, 520, -210]), mat);

          let r = ident_mat3;
          r = mat3_mul(rot_y_mat3(pi / 2), r);
          r = mat3_mul(rot_z_mat3(pi), r);
          gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force6_color, 10);
        }

        {
          let mat = scale_mat4(base_scale * 3);
          mat = mat4_mul(rot_y_mat4(pi / 2), mat);
          mat = mat4_mul(rot_z_mat4(-steer_axis_angle), mat);
          mat = mat4_mul(translation_mat4([870, 380 - sin(a) * 30, 68]), mat);

          let r = ident_mat3;
          r = mat3_mul(rot_y_mat3(pi / 2), r);
          r = mat3_mul(rot_z_mat3(-steer_axis_angle), r);
          gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force6_color, 10);
        }

        {
          let mat = scale_mat4(base_scale * 3 * 2.5);
          mat = mat4_mul(translation_mat4([890, 300, 40]), mat);

          let r = ident_mat3;
          gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force_color, 10);
        }

        {
          let mat = scale_mat4(base_scale * 3 * 2.5);
          mat = mat4_mul(rot_x_mat4(pi), mat);
          mat = mat4_mul(translation_mat4([890, 300, -40]), mat);

          let r = ident_mat3;
          r = mat3_mul(rot_x_mat3(pi), r);
          gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force_color, 10);
        }


        ctx.drawImage(gl.finish(), 0, 0, width, height);

        ctx.feather(width * scale, height * scale,
          canvas.height * 0.1, canvas.height * 0.1,
          canvas.height * 0.1, canvas.height * 0.1);

      } else if (mode === "bike_caster" || mode === "bike_caster2") {

        let t = slider_args[0];


        let steer_angle = mode === "bike_caster" ? t * t * 0.04 : smooth_step(1, 0, t) * 0.25;

        let rr = 5;

        let mvp = mat4_mul(vp, scale_mat4(3));
        mvp = mat4_mul(mvp, translation_mat4([-880, 140, 0]));

        if (mode === "bike_caster2")
          mvp = mat4_mul(mvp, translation_mat4([0, -90, 0]));

        gl.begin(width, height);

        draw_bike(mvp, rot, {
          steer_angle: steer_angle
        });

        let aa = t * 0.25;;

        let mm, r;


        mm = translation_mat4([0, 1, 0]);
        mm = mat4_mul(scale_mat4([rr, 400, rr]), mm);
        mm = mat4_mul(rot_z_mat4(-steer_axis_angle - pi / 2), mm);
        mm = mat4_mul(translation_mat4(front_down), mm);

        r = ident_mat3;

        gl.draw_mesh("Cylinder", mat4_mul(mvp, mm), mat3_mul(rot, r), {
          color: force1_color,
        });


        let ll = 30;
        let sc = 3;

        if (mode === "bike_caster") {


          mm = translation_mat4([0, 1, 0]);
          mm = mat4_mul(scale_mat4([rr, -(ll + 40) * 0.5 * sc * cos(aa), rr]), mm);
          mm = mat4_mul(translation_mat4(vec_add(front, [0, -tire_outer_R, 0])), mm);

          r = ident_mat3;

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mm), mat3_mul(rot, r), {
            color: hex_to_color("#666666"),
          });




          mm = translation_mat4([0, 1, 0]);
          mm = mat4_mul(scale_mat4([rr, (ll + 40) * 0.5 * sc * sin(aa), rr]), mm);
          mm = mat4_mul(rot_x_mat4(-pi / 2), mm);
          mm = mat4_mul(translation_mat4(vec_add(front, [0, -tire_outer_R, 0])), mm);

          r = rot_x_mat3(-pi / 2);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mm), mat3_mul(rot, r), {
            color: force6_color
          });




          {
            let mat = ident_mat4;
            mat = mat4_mul(scale_mat4(sc), mat);
            mat = mat4_mul(rot_x_mat4(pi / 2 + aa), mat);

            mat = mat4_mul(translation_mat4(vec_add(front, [0, -tire_outer_R, 0])), mat);

            let r = ident_mat3;
            r = mat3_mul(rot_x_mat3(pi / 2 + aa), r);
            gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force_color, ll);
          }


        } else {
          {
            let mat = ident_mat4;
            mat = mat4_mul(scale_mat4(sc * abs(steer_angle) * 5), mat);

            mat = mat4_mul(translation_mat4([-50, 0, 0]), mat);
            mat = mat4_mul(rot_y_mat4(steer_angle), mat);
            mat = mat4_mul(translation_mat4([50, 0, 0]), mat);


            mat = mat4_mul(translation_mat4(vec_add(front, [0, -tire_outer_R, 0])), mat);

            let r = ident_mat3;
            r = mat3_mul(rot_x_mat3(pi / 2 + aa), r);
            gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force2_color, ll);
          }
        }

        ctx.drawImage(gl.finish(), 0, 0, width, height);

        ctx.feather(width * scale, height * scale,
          canvas.height * 0.1, canvas.height * 0.1,
          canvas.height * 0.1, canvas.height * 0.1);

      } else if (mode === "pacejka" || mode === "pacejka2") {


        let D = 0.15 * 7.1 * slider_args[0] * 0.25 * (4 - slider_args[0]);
        let C = 2;
        let B = 0.92;
        let E = 0.9;
        let Di = 0.91;

        let hh = 0.45;

        if (mode === "pacejka2") {
          D = 0.15 * 6.6 * slider_args[0] * 0.25 * (4 - slider_args[0]);
          C = 1.7;
          B = 0.63;
          E = 1;
          Di = 1.0;
          hh = 0.5;
        }


        ctx.translate(round(width / 2), round(height * hh));


        ctx.lineWidth = height * 0.012;
        let n = 64;

        ctx.beginPath();

        for (let i = 0; i < n; i++) {

          let x = 10 * 0.6 * i / n;
          let y = D * sin(C * atan(B * x - E * (B * x - atan(B * x))));

          let px = width * 0.5 * i / n;
          let py = -height * hh * y;
          ctx.lineTo(px, py);
        }

        ctx.stroke();


        ctx.beginPath();

        for (let i = 0; i < n; i++) {

          let x = 10 * 0.6 * i / n;
          let y = Di * D * sin(C * atan(B * x - E * (B * x - atan(B * x))));

          let px = -width * 0.5 * i / n;
          let py = height * hh * y;
          ctx.lineTo(px, py);
        }

        ctx.stroke();


        let grd = ctx.createLinearGradient(0, -height * hh, 0, height * hh);
        grd.addColorStop(0.1, "#2664C0");
        grd.addColorStop(0.5, "#ccc");
        grd.addColorStop(0.9, "#DF6C52");
        ctx.fillStyle = grd;
        ctx.globalAlpha = 0.9;
        ctx.globalCompositeOperation = "source-in";
        ctx.fillRect(-width / 2, -height, width, height * 2);

        ctx.fillStyle = "#333";
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;

        ctx.globalCompositeOperation = "destination-over";

        ctx.strokeStyle = "#333";

        let fs = ceil(font_size * 0.7);
        let nn = mode === "pacejka" ? 6 : 6;

        ctx.font = fs + "px IBM Plex Sans";
        for (let i = 1; i < nn; i++) {
          let px = round(width * 0.5 / nn) * i;
          ctx.strokeLine(px, -height * 0.01, px, height * 0.01);
          ctx.strokeLine(-px, -height * 0.01, -px, height * 0.01);

          let a = (i * 0.1).toFixed(1);

          if (mode === "pacejka2") {
            a = (i * 15 / (nn - 1)) + "°";
          }
          ctx.fillText(a, px, height * 0.01 + fs);
          ctx.fillText("−" + a + " ", -px, height * 0.01 + fs);
        }

        for (let i = -nn; i < nn; i++) {
          let py = round(height * 0.5 / nn) * i;
          ctx.strokeLine(-height * 0.01, py, height * 0.01, py);
        }


        ctx.strokeLine(-width, 0, width, 0);
        ctx.strokeLine(0, -height, 0, height);


        ctx.globalAlpha = 0.05;
        for (let i = -nn; i < nn; i++) {
          let px = round(width * 0.5 / nn) * i;
          ctx.strokeLine(px, -height, px, height);
        }

        for (let i = -6; i < 6; i++) {
          let py = round(height * 0.5 / 6) * i
          ctx.strokeLine(-width, py, width, py);
        }

        ctx.globalAlpha = 1;

        ctx.feather(width * scale, height * (hh * 2) * scale,
          canvas.height * 0.13, canvas.height * 0.13,
          canvas.height * 0.13, canvas.height * 0.13);

        ctx.fillText("slip", width * 0.47 - 5, height * 0.01 + fs);


        ctx.fillText(mode === "pacejka" ? "ratio" : "angle", width * 0.47 - 5, height * 0.01 + fs + fs);

        ctx.textAlign = "right";
        ctx.fillText("output", -width * 0.01, -height * 0.4);
        ctx.fillText("force", -width * 0.01, -height * 0.4 + fs);
        ctx.textAlign = "center";


        ctx.font = ceil(font_size * 0.8) + "px IBM Plex Sans";
        if (mode === "pacejka") {

          ctx.fillText("  wheel faster than free →", width * 0.25, height * 0.5);
          ctx.fillText("← wheel slower than free  ", -width * 0.25, height * 0.5);
        }


        let s = round(height * 0.12);

        ctx.translate(round(-width / 2) + 5 + s, round(-height * hh) + 5 + s);

        ctx.globalCompositeOperation = "source-over"
        ctx.strokeStyle = "#D0B690";
        ctx.lineWidth = s * 0.1;
        ctx.strokeEllipse(0, 0, s * 0.9);

        ctx.strokeStyle = "#111";
        ctx.lineWidth = s * 0.05;
        ctx.strokeEllipse(0, 0, s * 0.975);

        ctx.fillStyle = "#bbb";
        ctx.fillEllipse(0, 0, s * 0.1);

        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(0,0,0,0.2)"

        for (let i = 0; i < 32; i++) {

          let active = i & 1 ? (i & 2) == 0 : (i & 2) == 2;

          let side0 = i & 1 ? 1 : -1;
          let side1 = i & 2 ? 1 : -1;
          let a = i * 2 * pi / n_spokes;

          let p0 = [cos(a - 1) * s * 0.1, sin(a - 1) * s * 0.1];

          a -= 3 / 8 * 2 * pi * active;


          let p1 = [cos(a) * s * 0.85, sin(a) * s * 0.85];

          ctx.strokeLine(p0[0], p0[1], p1[0], p1[1])
        }

        ctx.strokeStyle = "#333";
        ctx.strokeLine(-s, s, s, s);

        let ss = s * sharp_step(0, 0.4, slider_args[0]);

        ctx.fillStyle = force_color_css[0];
        ctx.strokeStyle = force_color_css[1];
        ctx.arrow(0, 0, 0, s * slider_args[0] * 0.9, 0.1 * ss, 0.25 * ss, 0.3 * ss);
        ctx.fill();
        ctx.stroke();


      } else if (mode === "contact_patch") {
        let pad = 5;
        let a_size = height - pad * 2;

        arcball.set_viewport(width - a_size - pad, pad, a_size, a_size);

        let mvp = mat4_mul(vp, scale_mat4(3.2));
        mvp = mat4_mul(translation_mat4([-0.5, 0, 0]), mvp);

        let ty = slider_args[0] * 4;

        gl.begin(width, height);

        draw_wheel(mat4_mul(mvp, translation_mat4([0, ty, 0])), rot, false, true);

        let mat = scale_mat4(2.5 * slider_args[0]);
        mat = mat4_mul(rot_x_mat4(pi / 2), mat);
        mat = mat4_mul(translation_mat4([+hub_width / 2 + 20, ty, 0]), mat);

        let r = rot_x_mat3(pi / 2);

        gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force_color, 10);

        mat = mat4_mul(translation_mat4([-hub_width - 40, 0, 0]), mat);

        gl.draw_arrow(mat4_mul(mvp, mat), mat3_mul(rot, r), force_color, 10);

        let scale = 750 / 4;


        let quad_mat = mat4_mul(scale_mat4(scale), translation_mat4([0, -0.5, -0.5]));
        quad_mat = mat4_mul(rot_z_mat4(pi / 2), quad_mat);
        quad_mat = mat4_mul(translation_mat4([0, tire_outer_R, 0]), quad_mat);
        gl.draw_quad(mat4_mul(mvp, quad_mat), rot, [0.01, 0.01, 0.05, 0.20], "feather_disc");


        mat = mat4_mul(scale_mat4([1, 2, 1]), rot_y_mat4(-pi / 2));

        mat = mat4_mul(translation_mat4([1.05, -1, 0]), mat);
        mat = mat4_mul(scale_mat4(0.95), mat);

        gl.draw_quad(mat, ident_mat3, [0.01, 0.01, 0.05, 0.20], "feather_disc");
        gl.draw_quad(mat, ident_mat3, [0.25, 0.25, 0.25, 1], "torus", [tire_outer_R / scale, tire_r / scale, ty / scale, 0]);


        ctx.drawImage(gl.finish(), 0, 0, width, height);

        ctx.strokeStyle = "#aaa";
        ctx.setLineDash([height * 0.01, height * 0.02]);
        ctx.strokeLine(width / 2, 0, width / 2, height);
      } else if (mode === "slip_angle" || mode === "slip_angle2") {


        let a = (slider_args[0] - (mode === "slip_angle2" ? 1 : 0.5)) * 0.4

        let slip = (slider_args[1] - 0.5) * 2 * -0.13;

        let fi = 0.17;
        let r1 = tire_outer_R
        let re = r1 * cos(fi);


        gl.begin(width, height);

        let mvp = ident_mat4;
        mvp = mat4_mul(translation_mat4([0, re, 0]), mvp);
        mvp = mat4_mul(scale_mat4(mode === "slip_angle" ? 6 : 2), mvp);
        mvp = mat4_mul(rot_z_mat4(pi), mvp);
        mvp = mat4_mul(rot_x_mat4(pi), mvp);
        mvp = mat4_mul(mat3_to_mat4(rot), mvp);
        mvp = mat4_mul(proj, mvp);

        let rrot = rot_z_mat3(pi);

        rrot = mat3_mul(rot_x_mat3(pi), rrot);
        rrot = mat3_mul(rot, rrot);

        let arrow_mat = scale_mat4(2);
        arrow_mat = mat4_mul(rot_z_mat4(pi / 2), arrow_mat);
        arrow_mat = mat4_mul(rot_x_mat4(pi), arrow_mat);
        arrow_mat = mat4_mul(translation_mat4([0, -tire_outer_R * (mode === "slip_angle" ? 1 : 0), a * tire_outer_R + (mode === "slip_angle" ? 330 : 550)]), arrow_mat);


        let arrow_r = mat3_mul(rot_x_mat3(pi), rot_z_mat3(pi / 2));

        gl.draw_arrow(mat4_mul(mvp, arrow_mat), mat3_mul(rrot, arrow_r), force1_color, 40);


        let wheel_mat = rot_x_mat4(a);
        wheel_mat = mat4_mul(rot_y_mat4(slip), wheel_mat);
        wheel_mat = mat4_mul(translation_mat4([0, 0, a * tire_outer_R]), wheel_mat);

        let wheel_r = mat3_mul(rot_y_mat3(slip), rot_x_mat3(a));


        if (mode === "slip_angle") {

          let ss = sin(-(slider_args[1] - 0.5) * pi);
          arrow_mat = translation_mat4([0, 0, -50]);
          arrow_mat = mat4_mul(scale_mat4(2 * ss), arrow_mat);
          arrow_mat = mat4_mul(translation_mat4([0, -20, -10 * (ss > 0 ? 1 : -1)]), arrow_mat);
          arrow_mat = mat4_mul(rot_z_mat4(pi / 2), arrow_mat);
          arrow_mat = mat4_mul(rot_x_mat4(pi), arrow_mat);
          arrow_mat = mat4_mul(rot_y_mat4(pi / 2 + slip), arrow_mat);
          arrow_mat = mat4_mul(translation_mat4([0, -tire_outer_R, a * tire_outer_R]), arrow_mat);

          arrow_r = rot_z_mat3(pi / 2);
          arrow_r = mat3_mul(rot_x_mat3(pi), arrow_r);
          arrow_r = mat3_mul(rot_y_mat3(pi / 2 + slip), arrow_r);

          gl.draw_arrow(mat4_mul(mvp, arrow_mat), mat3_mul(rrot, arrow_r), force2_color);


          let c = cos(slip);
          let s = sin(slip);

          function deflection(a) {
            a = max(0, a - pi + fi);

            let d = a * tire_outer_R;
            let x = 1 - smooth_step((2 - 3 * abs(s)) * fi, 2.3 * fi, a);
            return [s * d * x, 0, 0];
          }



          for (let i = -30; i < 30; i++) {

            let aa = pi + i * 0.04;
            let ta = aa + a;

            let s = smooth_step(pi - 0.7, pi - 0.4, ta) - smooth_step(pi + 0.4, pi + 0.7, ta);

            if (s == 0)
              continue;


            let def = deflection(ta);
            let c = abs(def[0]) * 0.1;


            let color = vec_lerp(hex_to_color("#444444"), force_color, c);

            let mat = scale_mat4(3 * s);
            mat = mat4_mul(translation_mat4([0, tire_outer_R, 0]), mat);
            mat = mat4_mul(rot_x_mat4(aa), mat);
            mat = mat4_mul(translation_mat4(def), mat);
            mat = mat4_mul(wheel_mat, mat);

            gl.draw_simple_mesh("sphere", mat4_mul(mvp, mat), mat3_mul(rrot, wheel_r), color);
          }

        }

        {

          let arrow_mat = scale_mat4(2);
          arrow_mat = mat4_mul(rot_z_mat4(pi / 2), arrow_mat);
          arrow_mat = mat4_mul(rot_x_mat4(pi), arrow_mat);
          arrow_mat = mat4_mul(translation_mat4([0, 0, (mode === "slip_angle" ? 332 : 552)]), arrow_mat);
          arrow_mat = mat4_mul(rot_y_mat4(slip), arrow_mat);
          arrow_mat = mat4_mul(translation_mat4([0, 2 - tire_outer_R * (mode === "slip_angle" ? 1 : 0), a * tire_outer_R]), arrow_mat);


          arrow_r = rot_z_mat3(pi / 2);
          arrow_r = mat3_mul(rot_x_mat3(pi), arrow_r);
          arrow_r = mat3_mul(rot_y_mat3(slip), arrow_r);

          gl.draw_arrow(mat4_mul(mvp, arrow_mat), mat3_mul(rrot, arrow_r), force6_color, 40);



          if (mode === "slip_angle2") {
            draw_wheel(mat4_mul(mvp, wheel_mat), mat3_mul(rrot, wheel_r), false, true);
          } else {
            let mat = scale_mat4([1, 500, 1]);
            mat = mat4_mul(rot_x_mat4(pi / 2), mat)
            mat = mat4_mul(translation_mat4([0, -tire_outer_R, 0]), mat)

            let r = ident_mat3;

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: force1_color });
          }
        }

        if (mode === "slip_angle") {

          wheel_mat = rot_x_mat4(pi);
          wheel_mat = mat4_mul(rot_y_mat4(slip), wheel_mat);
          wheel_mat = mat4_mul(translation_mat4([0, 0, a * tire_outer_R]), wheel_mat);

          wheel_r = mat3_mul(rot_y_mat3(slip), rot_x_mat3(a));



          let params = [fi, tire_outer_R, sin(slip), a];

          gl.draw_simple_mesh("torus_h", mat4_mul(mvp, wheel_mat), mat3_mul(rrot, arrow_r), vec_scale([0.5, 0.5, 0.5, 1], 0.2), "tire", params);

        }



        let quad_mat = mat4_mul(scale_mat4(500), translation_mat4([0, -0.5, -0.5]));
        quad_mat = mat4_mul(rot_z_mat4(pi / 2), quad_mat);
        quad_mat = mat4_mul(translation_mat4([0, -re, 0]), quad_mat);

        {
          let s = 3000;

          let quad_mat = mat4_mul(scale_mat4(s), translation_mat4([0, -0.5, -0.5]));
          quad_mat = mat4_mul(rot_z_mat4(pi / 2), quad_mat);
          quad_mat = mat4_mul(rot_y_mat4(pi / 2), quad_mat);
          quad_mat = mat4_mul(translation_mat4([0, -tire_outer_R, 500]), quad_mat);


          gl.draw_quad(mat4_mul(mvp, quad_mat), rrot, [0.01, 0.01, 0.03, 0.1], "feather_disc",
            [0, 0, 7, 0.2]);
        }



        ctx.drawImage(gl.finish(), 0, 0, width, height);

        if (mode === "slip_angle2") {
          ctx.translate(width * 0.5, height * 0.5);

          let alpha = smooth_step(0.8, 0.9, abs(rrot[5]));

          if (alpha != 0)
            {
              ctx.strokeStyle = "rgba(80, 80, 80, 0.7)" 
              ctx.globalAlpha = alpha;

              let tr = translation_mat4([0, 0, a * tire_outer_R]);
              let mat = rot_y_mat4(slip);
              mat = mat4_mul(tr, mat);


              let p0 = project(mat4_mul_vec3(mat4_mul(mvp, mat), [0, 0, 0]));
              let p1 = project(mat4_mul_vec3(mat4_mul(mvp, mat), [0, 0, 600]));
              let p2 = project(mat4_mul_vec3(mat4_mul(mvp, tr), [0, 0, 600]));

              ctx.strokeLine(p0[0], p0[1], p1[0], p1[1]);
              ctx.strokeLine(p0[0], p0[1], p2[0], p2[1]);

              ctx.lineWidth = width * 0.007;
              ctx.lineCap = "butt";

              let ll = vec_len(vec_sub(p1, p0));
              ctx.beginPath()
              for (let i = 0; i <= 10; i++) {
                let p = vec_lerp(p1, p2, i / 10);
                let d = vec_sub(p, p0);
                d = vec_norm(d);
                p = vec_add(p0, vec_scale(d, ll * 0.98));

                ctx.lineTo(p[0], p[1]);
              }
              ctx.stroke();
            }
        }



        ctx.feather(width * scale, height * scale,
          canvas.height * 0.15, canvas.height * 0.15,
          canvas.height * 0.15, canvas.height * 0.15);
      } else if (mode === "beam_forces") {


        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "rgba(50,50,50,0.6)";

        ctx.setLineDash([width * 0.008, width * 0.008]);
        ctx.strokeLine(width * 0.1, height / 2, width * 0.9, height / 2);
        ctx.setLineDash([]);

        ctx.translate(width / 2, height * 0.25);

        ctx.fillStyle = "#ddd";
        ctx.strokeStyle = "#333";

        let ratio = 0.6;
        let fc = slider_args[0];
        let f1 = fc * ratio;
        let f0 = fc * (1 - ratio);

        let fade_a = 0.1;

        let t = lerp(0.01, 0.99, slider_args[1]);

        let h = width * 0.04 * 0.9;
        let w = width * 0.7 * 0.9;
        let s;


        for (let i = 0; i < 2; i++) {

          ctx.globalAlpha = i == 1 ? fade_a : 1;


          ctx.fillStyle = "#ddd";
          ctx.strokeStyle = "#333";


          ctx.beginPath();


          ctx.rect(-w * 0.5, -h / 2, w, h);
          ctx.fill();
          ctx.stroke();

          if (i == 1) {



            ctx.globalAlpha = 1;

            ctx.beginPath();
            ctx.rect(-w * 0.5, -h / 2, w * t, h);
            ctx.fill();


            ctx.beginPath();
            for (let i = 0; i <= 16; i++) {
              ctx.lineTo(w * (-0.5 + t) + (hash(i + 20) - 0.5) * 2, h * (i / 16 - 0.5));
            }
            ctx.lineTo(w * (-0.5), h / 2);
            ctx.lineTo(w * (-0.5), -h / 2);
            ctx.closePath();
            ctx.stroke();
          }


          ctx.fillStyle = force2_color_css[0];
          ctx.strokeStyle = force2_color_css[1];

          s = f0 * width * 0.1;

          ctx.beginPath();
          ctx.arrow(-w / 2, h / 2 + s, -w / 2, h / 2, 0.2 * s, 0.5 * s, 0.6 * s);

          ctx.fill();
          ctx.stroke();

          s = f1 * width * 0.1;

          ctx.globalAlpha = i == 1 && t < 1 ? fade_a : 1;
          ctx.beginPath();
          ctx.arrow(w / 2, h / 2 + s, w / 2, h / 2, 0.2 * s, 0.5 * s, 0.6 * s);
          ctx.fill();
          ctx.stroke();

          s = fc * width * 0.1;
          ctx.globalAlpha = i == 1 && t < ratio ? fade_a : 1;
          ctx.beginPath();
          ctx.arrow(-w / 2 + w * ratio, -h / 2 - s, -w / 2 + w * ratio, -h / 2, 0.2 * s, 0.5 * s, 0.6 * s);
          ctx.fill();
          ctx.stroke();

          ctx.translate(0, height * 0.5);
        }


        ctx.globalAlpha = 1;
        ctx.translate(w * (-0.5 + t), -height * 0.5);



        ctx.save();


        ctx.fillStyle = force6_color_css[0];
        ctx.strokeStyle = force6_color_css[1];

        let ff = t < ratio ? f0 : -f1;

        {
          s = ff * width * 0.1;
          ctx.beginPath();
          ctx.arrow(0, -s, 0, 0, 0.2 * abs(s), 0.5 * abs(s), 0.6 * abs(s));
          ctx.fill();
          ctx.stroke();
        }

        let mom = 8 * (t * f0 - fc * max(0, t - ratio));


        ctx.translate(w * 0.01, 0);

        ctx.scale(mom, mom);
        ctx.lineWidth = 1.5 / mom;
        ctx.translate(w * 0.07, 0);
        ctx.rotate(-pi); {
          ctx.fillStyle = force_color_css[0];
          ctx.strokeStyle = force_color_css[1];

          let a = 1;
          let r = width * 0.04;
          let w = width * 0.02;
          let s = 1;

          ctx.beginPath();
          ctx.arc(0, 0, r + w / 2, Math.PI * (0.5 + a), Math.PI * 0.5, true);
          ctx.lineTo(0, r + 1.2 * w * s);
          ctx.lineTo(2 * w * s * 1.2, r);
          ctx.lineTo(0, r - 1.2 * w * s);
          ctx.arc(0, 0, r - w / 2, Math.PI * 0.5, Math.PI * (0.5 + a));
          ctx.closePath();

          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();



      }


      /* Helpers */

      function project(p) {
        p = vec_scale(p, 1 / p[3]);
        p[0] *= width * 0.5;
        p[1] *= -height * 0.5;
        return p;
      }

      function bisect(a, b, f) {
        let fa = f(a);

        for (let i = 0; i < 30; i++) {
          let mid = (a + b) / 2;
          let fmid = f(mid);

          if (Math.abs(fmid) < 0.000001)
            return mid;

          if ((fmid > 0 && fa > 0) || (fmid < 0 && fa < 0)) {
            a = mid;
            fa = f(a);
          } else {
            b = mid;
          }
        }

        return a;
      }

      function handle_bar_positions(steer_angle) {

        let steer_axis_mat = rot_z_mat3(atan2(steer_axis[0], steer_axis[1]));

        let steer_mat = translation_mat4(vec_neg(front_down));

        steer_mat = mat4_mul(mat3_to_mat4(steer_axis_mat), steer_mat);
        steer_mat = mat4_mul(rot_y_mat4(steer_angle), steer_mat);
        steer_mat = mat4_mul(mat3_to_mat4(mat3_transpose(steer_axis_mat)), steer_mat);
        steer_mat = mat4_mul(translation_mat4(front_down), steer_mat);


        let p = vec_add(front_up, vec_scale(steer_axis, 100));

        return [
          mat4_mul_vec3(steer_mat, vec_add(p, [100, 0, -150])).slice(0, 3),
          mat4_mul_vec3(steer_mat, vec_add(p, [100, 0, +150])).slice(0, 3)
        ];
      }

      function cranks_positions(crank_angle) {

        return [
          vec_add(sprocket, mat3_mul_vec(rot_z_mat3(-crank_angle), [0, crank_length, 0])),
          vec_add(sprocket, mat3_mul_vec(rot_z_mat3(-crank_angle + pi), [0, crank_length, 0]))
        ];
      }

      function spoke_bend(start_length, expected_length, pin = false) {

        function arc_length(bend, length) {
          let len = 0;
          let n = 32;
          let h = length / n;

          for (let i = 0; i < n; i++) {
            let x = i * h;
            let f;
            if (pin)
              f = bend * (pi / length * cos(pi * x / length));
            else
              f = bend * (2 * pi / length * sin(pi * x / length) * cos(pi * x / length));
            len += h * sqrt(1 + f * f);
          }
          return len;
        }

        if (expected_length >= start_length)
          return 0;

        return bisect(0, 100, function(bend) {
          return arc_length(bend, expected_length) - start_length;
        })
      }

      function draw_cog(cog_r, p = [0, 0], color = "#000") {

        ctx.lineWidth = cog_r / 4;

        ctx.save();
        ctx.translate(p[0], p[1]);


        ctx.fillStyle = "#fff";
        ctx.beginPath();

        ctx.ellipse(0, 0, cog_r, cog_r, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.clip();
        ctx.fillStyle = color;
        ctx.fillRect(0, -cog_r, cog_r, cog_r);
        ctx.fillRect(-cog_r, 0, cog_r, cog_r);

        ctx.restore();

        ctx.strokeStyle = color;
        ctx.strokeEllipse(p[0], p[1], cog_r);
      }

      function draw_ground(x_offset, y_offset, width, height, dirt = false) {


        ctx.save();
        ctx.translate(0, y_offset);


        let h = height * 0.0007;

        let kk = ceil((x_offset + 10) / width);

        ctx.translate(-((x_offset + 10) % width), 0);

        ctx.beginPath();
        ctx.lineTo(-width * 0.5, height);

        for (let i = 0; i < 200; i++) {
          ctx.lineTo(-width * 0.5 + i * width * 0.01,
            h * hash(i));
        }

        ctx.lineTo(width * 1.5, height);


        if (dirt) {
          ctx.fillStyle = "#908474"
          ctx.strokeStyle = "#706657";
          ctx.fill();
          ctx.stroke();



          ctx.strokeStyle = "#333";
          ctx.lineWidth = height * 0.001;


          for (let i = 0; i < 30; i++) {

            let p = kk * 10 + i;
            let ph = hash(p);
            let w = (ph * 3 + 2) * height * 0.002;
            let h = (ph * 2 + 2) * height * 0.002;

            ctx.fillStyle = rgba_color_string([ph * 0.5, ph * 0.5, ph * 0.5, 0.5]);

            ctx.globalAlpha = 0.5 + 0.5 * hash(p);
            ctx.beginPath();
            let x = (i - 10 + hash(p + 12.2) * 2) * width / 10;
            let y = height * 0.01 * (3 + 6 * hash(p + 12.2))

            ctx.beginPath();
            ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
            ctx.fill();

          }

        } else {
          ctx.fillStyle = "#A5A3AB"
          ctx.strokeStyle = "#555";
          ctx.fill();
          ctx.stroke();

        }
        ctx.globalAlpha = 1;





        ctx.restore();
      }

      function draw_background(x, y, rot = undefined, scale = 1, lines = true, a = 0) {
        let mat = mat4_mul(translation_mat4([-1, -1, 0.99]), mat4_mul(scale_mat4(2), rot_y_mat4(pi / 2)));
        mat = mat4_mul(rot_z_mat4(a), mat);

        let params = [x, y, 1 / scale, rot || 0];
        let params2 = [lines ? 1 : 0, rot === undefined ? 0 : 1, 0, 0];
        gl.draw_quad(mat, ident_mat3, [0, 0, 0, 0], "background", params, params2);
      }

      function draw_human(mvp, rot, skin_mats) {
        let draw_matrices = new Array(skin_mats[0].length);

        for (let side = 0; side < 2; side++) {



          function recurse(mat, bone) {
            let local = mat3_to_mat4(skin_mats[side][bone.index]);
            let parent = bone.parent_transform;

            let t = bone.inv_transform;
            mat = mat4_mul(mat, mat4_mul(parent, local));

            t = mat4_mul(mat, t);

            draw_matrices[bone.index] = mat4_transpose(t);
            if (bone.children) {
              bone.children.forEach(child => {
                recurse(mat, child);
              })
            }
          }

          recurse(bone_hierarchy["Humanoid"][0].parent_transform, bone_hierarchy["Humanoid"][0].children[0]);

          gl.draw_skinned_mesh("Humanoid", mvp, rot, flatten(draw_matrices));


          let mat = rot_z_mat4(pi / 2);
          mat = mat4_mul(mat, scale_mat4([0.23, 0.2, 0.23]));
          mat = mat4_mul(translation_mat4([0, 0.0, 0.08]), mat);


          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), ident_mat3, {
            color: human_color,
            normal_f: 0,
            skip_lines: true,
          });

        }
      }

      function draw_bike(mvp, rot, params = {}) {


        let steer_axis_angle = base_steer_axis_angle;
        let steer_axis = [-cos(steer_axis_angle), sin(steer_axis_angle), 0];

        let front = [985, 0, 0];
        let fork_offset = 40;

        let front_down = vec_sub(front_up, vec_scale(steer_axis, 80));

        let front0 = vec_add(vec_sub(front_down, vec_scale(steer_axis, 390)), [-7, 4, +front_dropout_width / 2])
        let front1 = vec_add(vec_sub(front_down, vec_scale(steer_axis, 390)), [-7, 4, -front_dropout_width / 2]);

        if (params.steer_axis_angle) {

          fork_offset = params.fork_offset;
          steer_axis_angle = params.steer_axis_angle;

          steer_axis = [-cos(steer_axis_angle), sin(steer_axis_angle), 0];
          front_down = vec_sub(front_up, vec_scale(steer_axis, 80));

          let dx1 = -front_down[1] * tan(steer_axis_angle - pi / 2);
          let dx2 = fork_offset / cos(steer_axis_angle - pi / 2);


          front = front_down.slice();
          front[1] = 0;
          front[0] += dx1 + dx2;

          front0 = front.slice();
          front0[0] -= steer_axis[1] * fork_offset + 7;
          front0[1] += steer_axis[0] * fork_offset + 10;
          front0[2] = front_dropout_width / 2;

          front1 = front0.slice();
          front1[2] = -front_dropout_width / 2;
        }







        let mid;
        let front_mid = vec_lerp(front_up, front_down, 0.5);

        let steer_angle = params.steer_angle || 0;

        let seat_axis = vec_norm(vec_sub(seat, sprocket));
        let steer_axis_mat = rot_z_mat3(atan2(steer_axis[0], steer_axis[1]));
        let steer_mat = translation_mat4(vec_scale(front_down, -1));

        let seat_top2 = vec_add(seat, vec_scale(seat_axis, 70));


        steer_mat = mat4_mul(mat3_to_mat4(steer_axis_mat), steer_mat);
        steer_mat = mat4_mul(rot_y_mat4(steer_angle), steer_mat);
        steer_mat = mat4_mul(mat3_to_mat4(mat3_transpose(steer_axis_mat)), steer_mat);
        steer_mat = mat4_mul(translation_mat4(front_down), steer_mat);

        if (params.fem) {

          steer_mat = mat4_mul(translation_mat4(vec_neg(front_mid)), steer_mat);
          steer_mat = mat4_mul(rot_z_mat4(params.fem.front_a), steer_mat);
          steer_mat = mat4_mul(rot_x_mat4(params.fem.front_tilt), steer_mat);
          steer_mat = mat4_mul(translation_mat4(front_mid), steer_mat);
          steer_mat = mat4_mul(translation_mat4(params.fem.front), steer_mat);
        }

        let steer_rot = steer_axis_mat;
        steer_rot = mat3_mul(rot_y_mat3(steer_angle), steer_rot);
        steer_rot = mat3_mul(mat3_transpose(steer_axis_mat), steer_rot);

        if (params.wheel_separation) {
          mvp = mat4_mul(mvp, translation_mat4([0, params.wheel_separation, 0]));
        }

        {
          let s = vec_sub(rear, front_mid);
          let r = vec_sub(seat, sprocket);
          let t = vec_cross(vec_sub(seat, rear), s)[2] / vec_cross(r, s)[2];
          mid = vec_lerp(seat, sprocket, t);
        }


        let skipped_link_indices = params.skipped_link_indices ? params.skipped_link_indices : [19, 20, 21];
        let node_params = [

          { name: "rear0", position: vec_add(rear, [0, 0, +rear_dropout_width / 2]) },
          { name: "rear1", position: vec_add(rear, [0, 0, -rear_dropout_width / 2]) },
          { name: "seat_stays_top0", position: vec_add(seat, [0, 0, +5]) },
          { name: "seat_stays_top1", position: vec_add(seat, [0, 0, -5]) },
          { name: "seat_stays_bottom0", position: vec_add(rear, [10, 10, +rear_dropout_width / 2]) },
          { name: "seat_stays_bottom1", position: vec_add(rear, [10, 10, -rear_dropout_width / 2]) },
          { name: "seat_stays_brake0", position: vec_lerp(vec_add(seat, [0, 0, +5]), vec_add(rear, [10, 10, +rear_dropout_width / 2]), 0.32) },
          { name: "seat_stays_brake1", position: vec_lerp(vec_add(seat, [0, 0, -5]), vec_add(rear, [10, 10, -rear_dropout_width / 2]), 0.32) },
          { name: "front0", position: front0 },
          { name: "front1", position: front1 },
          { name: "sprocket", position: sprocket },
          { name: "chain_stays_top0", position: vec_add(sprocket, [0, 0, +20]) },
          { name: "chain_stays_top1", position: vec_add(sprocket, [0, 0, -20]) },
          { name: "chain_stays_bottom0", position: vec_add(rear, [15, -4, +rear_dropout_width / 2]) },
          { name: "chain_stays_bottom1", position: vec_add(rear, [15, -4, -rear_dropout_width / 2]) },
          { name: "sprocket0", position: vec_add(sprocket, [0, 0, +34]) },
          { name: "sprocket1", position: vec_add(sprocket, [0, 0, -34]) },
          { name: "seat", position: seat },
          { name: "seat_top", position: vec_add(seat, vec_scale(seat_axis, 20)) },
          { name: "seat_top2", position: seat_top2 },
          { name: "front", position: front },
          { name: "front_up", position: front_up },
          { name: "front_down", position: front_down },
          { name: "front_bottom", position: vec_sub(front_down, vec_scale(steer_axis, 40)) },
          { name: "front_down0", position: vec_add(vec_sub(front_down, vec_scale(steer_axis, 42)), [-1, 0, +30]) },
          { name: "front_down1", position: vec_add(vec_sub(front_down, vec_scale(steer_axis, 42)), [-1, 0, -30]) },
          { name: "front_top", position: vec_add(front_up, vec_scale(steer_axis, 40)) },

          { name: "handle_bar0", position: vec_add(front_up, vec_scale(steer_axis, 114)) },
          { name: "handle_bar1", position: vec_add(vec_add(front_up, vec_scale(steer_axis, 94)), [-0, 0, 0]) },
          { name: "handle_bar2", position: vec_add(vec_add(front_up, vec_scale(steer_axis, 100)), [100, 0, 0]) },

          { name: "handle_bar3", position: vec_add(vec_add(front_up, vec_scale(steer_axis, 100)), [100, 0, -100]) },
          { name: "handle_bar4", position: vec_add(vec_add(front_up, vec_scale(steer_axis, 100)), [100, 0, +100]) },

          { name: "mid", position: mid },
          { name: "front_mid", position: front_mid },
        ];


        function node_index(name) { return node_params.findIndex(el => el.name === name) };

        function node_position(name) { return node_params[node_index(name)].position; };

        let link_params = [
          { i0: node_index("chain_stays_top0"), i1: node_index("chain_stays_bottom0"), r: [0.018 / 2, 0.026 / 2, 0.016 / 2, 0.016 / 2], cap: true },
          { i0: node_index("chain_stays_top1"), i1: node_index("chain_stays_bottom1"), r: [0.018 / 2, 0.026 / 2, 0.016 / 2, 0.016 / 2], cap: true },
          { i0: node_index("sprocket"), i1: node_index("sprocket0"), r: 0.02 },
          { i0: node_index("sprocket"), i1: node_index("sprocket1"), r: 0.02 },
          { i0: node_index("seat_stays_top0"), i1: node_index("seat_stays_bottom0"), r: [0.016 / 2, 0.016 / 2, 0.014 / 2, 0.014 / 2], cap: true },
          { i0: node_index("seat_stays_top1"), i1: node_index("seat_stays_bottom1"), r: [0.016 / 2, 0.016 / 2, 0.014 / 2, 0.014 / 2], cap: true },

          { i0: node_index("seat"), i1: node_index("sprocket"), r: 0.015 },
          { i0: node_index("seat"), i1: node_index("seat_top"), r: 0.015, },
          { i0: node_index("sprocket"), i1: node_index("front_down"), r: [0.028 / 2, 0.036 / 2, 0.028 / 2, 0.036 / 2] },
          { i0: node_index("front_down"), i1: node_index("front_up"), r: 0.033 / 2 },
          { i0: node_index("front_down"), i1: node_index("front_bottom"), r: 0.033 / 2 },
          { i0: node_index("front_top"), i1: node_index("front_up"), r: 0.033 / 2 },
          { i0: node_index("front_up"), i1: node_index("seat"), r: [0.032 / 2, 0.032 / 2, 0.03 / 2, 0.034 / 2] },
          { i0: node_index("front_down0"), i1: node_index("front0"), r: [0.024 / 2, 0.024 / 2, 0.014 / 2, 0.014 / 2], steer: true, offset: fork_offset, cap: true },
          { i0: node_index("front_down1"), i1: node_index("front1"), r: [0.024 / 2, 0.024 / 2, 0.014 / 2, 0.014 / 2], steer: true, offset: fork_offset, cap: true },

          { i0: node_index("front_top"), i1: node_index("handle_bar0"), r: 0.026 / 2, steer: true, paintless: true },

          { i0: node_index("handle_bar1"), i1: node_index("handle_bar2"), r: 0.030 / 2, steer: true, paintless: true },
          { i0: node_index("handle_bar3"), i1: node_index("handle_bar4"), r: 0.026 / 2, steer: true, paintless: true },
          { i0: node_index("seat_top"), i1: node_index("seat_top2"), r: 0.013, paintless: true },

          { i0: node_index("mid"), i1: node_index("front_mid"), r: 0.026 / 2 },
          { i0: node_index("mid"), i1: node_index("chain_stays_bottom1"), r: [0.02 / 2, 0.02 / 2, 0.014 / 2, 0.014 / 2], cap: true },
          { i0: node_index("mid"), i1: node_index("chain_stays_bottom0"), r: [0.02 / 2, 0.02 / 2, 0.014 / 2, 0.014 / 2], cap: true },

          { i0: node_index("front_bottom"), i1: node_index("front_top"), r: 0.03 / 2, steer: true },

          { i0: node_index("seat_stays_brake1"), i1: node_index("seat_stays_brake0"), r: [0.016 / 2, 0.016 / 2, 0.014 / 2, 0.014 / 2], cap: true },


        ];

        for (let i = 0; i < link_params.length; i++) {
          let link = link_params[i];

          if (skipped_link_indices.some(k => k == i))
            continue;

          if (link.steer) {
            if (params.frame_only)
              continue;
          } else if (params.fem) {
            continue;
          } else if (params.frame_only && i == 18)
            continue;

          let p0 = node_params[link.i0].position;
          let p1 = node_params[link.i1].position;

          let dir_x = vec_sub(p1, p0);
          let L = vec_len(dir_x);

          dir_x = vec_scale(dir_x, 1 / L);

          let dir_z = [0, 0, 1];
          if (abs(dir_x[2]) == 1) {
            dir_z = [-1, 0, 0];
          }
          dir_z = vec_sub(dir_z, vec_scale(dir_x, vec_dot(dir_z, dir_x)));

          let dir_y = vec_cross(dir_z, dir_x);

          let lrot = [dir_x[0], dir_y[0], dir_z[0],
            dir_x[1], dir_y[1], dir_z[1],
            dir_x[2], dir_y[2], dir_z[2]
          ];

          let mat = scale_mat4([1, 1, L / 1000]);
          mat = mat4_mul(scale_mat4(1000), mat);
          mat = mat4_mul(rot_y_mat4(pi / 2), mat);
          mat = mat4_mul(mat3_to_mat4(lrot), mat);
          mat = mat4_mul(translation_mat4(p0), mat);

          if (link.steer) {
            mat = mat4_mul(steer_mat, mat);
          }

          mat = mat4_mul(mvp, mat);

          let r = rot_y_mat3(pi / 2);
          r = mat3_mul(lrot, r);

          if (link.steer) {
            r = mat3_mul(steer_rot, r);
          }
          r = mat3_mul(rot, r);


          let color = link.paintless ? [0.8, 0.8, 0.8, 1] : frame_color;
          let offset = link.offset ? link.offset / 1000 : 0.0;

          let radius = link.r.constructor === Array ? link.r : [link.r, link.r, link.r, link.r];
          gl.draw_oval_tube(mat, r, radius, offset, color);


          if (link.cap) {
            let mat = scale_mat4(link.r[2] * 1000);

            mat = mat4_mul(translation_mat4([0, offset * 1000, 0]), mat);
            mat = mat4_mul(mat3_to_mat4(lrot), mat);
            mat = mat4_mul(translation_mat4(p1), mat);
            if (link.steer) {
              mat = mat4_mul(steer_mat, mat);
            }

            let r = lrot;

            if (link.steer) {
              r = mat3_mul(steer_rot, r);
            }

            gl.draw_simple_mesh("sphere", mat4_mul(mvp, mat), mat3_mul(rot, r), color);
          }
        }

        {
          let mat = rot_y_mat4(pi / 2);
          mat = mat4_mul(rot_z_mat4(pi), mat);
          mat = mat4_mul(translation_mat4(rear), mat);
          mat = mat4_mul(translation_mat4([0, 0, -rear_dropout_width / 2]), mat);

          let r = rot_y_mat3(pi / 2);
          r = mat3_mul(rot_z_mat3(pi), r);

          gl.draw_mesh("Dropout_rear", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: frame_color });

          mat = mat4_mul(translation_mat4([0, 0, rear_dropout_width]), mat);

          gl.draw_mesh("Dropout_rear", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: frame_color });
        }

        if (params.frame_only) {
          /* Mega hack. */

          {
            let mat = translation_mat4([0, -0.5, -0.5]);
            mat = mat4_mul(rot_y_mat4(pi / 2), mat);
            mat = mat4_mul(scale_mat4(0.0205 * 1000 * 2), mat);
            mat = mat4_mul(translation_mat4(node_position("sprocket1")), mat);

            let r = rot_y_mat3(pi / 2);

            gl.draw_quad(mat4_mul(mvp, mat), mat3_mul(rot, r), frame_color, "parallax_hole", [3, 0.85, 0, 0]);

            r = rot_y_mat3(-pi / 2);

            mat = mat4_mul(translation_mat4([0, 0, 34 * 2]), mat);
            gl.draw_quad(mat4_mul(mvp, mat), mat3_mul(rot, r), frame_color, "parallax_hole", [3, 0.85, 0, 0]);
          }

          {
            let mat = translation_mat4([0, -0.5, -0.5]);
            mat = mat4_mul(rot_z_mat4(-steer_axis_angle), mat);
            mat = mat4_mul(scale_mat4(0.017 * 1000 * 2), mat);
            mat = mat4_mul(translation_mat4(node_position("front_top")), mat);

            let r = rot_z_mat3(steer_axis_angle);
            gl.draw_quad(mat4_mul(mvp, mat), mat3_mul(rot, r), frame_color, "parallax_hole", [10, 0.9, 0, 0]);

            mat = mat4_mul(translation_mat4(vec_sub(node_position("front_bottom"), node_position("front_top"))), mat);

            gl.draw_quad(mat4_mul(mvp, mat), mat3_mul(rot, r), frame_color, "parallax_hole", [10, 0.9, 0, 0]);
          }

          {

            let p = vec_norm(vec_sub(seat, sprocket));
            let a = Math.acos(p[0]);
            let mat = translation_mat4([0, -0.5, -0.5]);
            mat = mat4_mul(rot_z_mat4(a), mat);
            mat = mat4_mul(scale_mat4(0.0155 * 1000 * 2), mat);
            mat = mat4_mul(translation_mat4(node_position("seat_top")), mat);

            let r = rot_z_mat3(a);
            gl.draw_quad(mat4_mul(mvp, mat), mat3_mul(rot, r), frame_color, "parallax_hole", [20, 0.9, 1, 0]);
          }

          return;
        }

        for (let i = 0; i < 2; i++) {
          let sign = i ? 1 : -1;
          let mat = steer_mat;

          mat = mat4_mul(mvp, mat);

          let r = 15;
          let p = vec_add(front_up, vec_scale(steer_axis, 100));
          p[0] += 100;

          let color = [0.3, 0.3, 0.3, 1.0];

          gl.draw_bezier(mat, rot, [
            vec_add(p, [0, 0, sign * 70]),
            vec_add(p, [0, 0, sign * 100]),
            vec_add(p, [0, 0, sign * 130]),
            vec_add(p, [0, 0, sign * 160]),
          ], r, [2 * pi, 2 * pi * 5], true, color);

          gl.draw_bezier(mat, rot, [
            vec_add(p, [0, 0, sign * 160]),
            vec_add(p, [0, 0, sign * 185]),
            vec_add(p, [25, 0, sign * 210]),
            vec_add(p, [50, 0, sign * 210]),
          ], r, [2 * pi, 2 * pi * 5], true, color);

          gl.draw_bezier(mat, rot, [
            vec_add(p, [50, 0, sign * 210]),
            vec_add(p, [120, 0, sign * 210]),
            vec_add(p, [110, -120, sign * 210]),
            vec_add(p, [-20, -150, sign * 210]),
          ], r, [2 * pi, 2 * pi * 14], true, color);

        }

        let sprocket_fem_offset = params.fem ? params.fem.sprocket : [0, 0, 0];

        let crank_width = 108;
        let crank_angle = params.crank_angle || 0; {
          let mat = rot_y_mat4(pi / 2);
          mat = mat4_mul(rot_z_mat4(-crank_angle), mat);
          mat = mat4_mul(translation_mat4(vec_add(sprocket_fem_offset, sprocket)), mat);
          mat = mat4_mul(translation_mat4([0, 0, -crank_width / 2]), mat);

          let r = mat3_mul(rot_z_mat3(-crank_angle), rot_y_mat3(pi / 2));

          gl.draw_mesh("Crank", mat4_mul(mvp, mat), mat3_mul(rot, r));


          r = mat3_mul(r, rot_z_mat3(pi));

          mat = mat4_mul(mat, rot_z_mat4(pi));
          mat = mat4_mul(translation_mat4([0, 0, crank_width]), mat);
          gl.draw_mesh("Crank", mat4_mul(mvp, mat), mat3_mul(rot, r));
        }

        {

          let mat = scale_mat4([20, 2, 20]);
          mat = mat4_mul(rot_x_mat4(pi / 2), mat);
          mat = mat4_mul(translation_mat4(vec_add(vec_add(sprocket_fem_offset, sprocket), [0, 0, -36])), mat);

          let r = rot_x_mat3(pi / 2);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: hex_to_color("#666666") });

          mat = mat4_mul(translation_mat4([0, 0, 72]), mat);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: hex_to_color("#666666") });

          mat = mat4_mul(mat, scale_mat4([0.6, 3, 0.6]));
          mat = mat4_mul(translation_mat4([0, 0, 7]), mat);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: hex_to_color("#999999") });

          mat = mat4_mul(mat, scale_mat4([1, 1.2, 1]));
          mat = mat4_mul(translation_mat4([0, 0, -89]), mat);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: hex_to_color("#999999") });

          if (params.fem) {
            mat = mat4_mul(mat, scale_mat4([1.5, 5, 1.5]));
            mat = mat4_mul(translation_mat4([0, 0, 45]), mat);

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: hex_to_color("#999999") });
          }

        }

        {

          let pedal_offset = 120;

          let mat = rot_y_mat4(pi / 2);
          mat = mat4_mul(rot_x_mat4(pi / 2), mat);
          mat = mat4_mul(rot_z_mat4(crank_angle + pi / 2 + (params.left_pedal_angle || 0)), mat);
          mat = mat4_mul(translation_mat4([0, -crank_length, -pedal_offset]), mat);
          mat = mat4_mul(rot_z_mat4(-crank_angle), mat);
          mat = mat4_mul(translation_mat4(vec_add(sprocket_fem_offset, sprocket)), mat);

          let r = rot_y_mat3(pi / 2);
          r = mat3_mul(rot_x_mat3(pi / 2), r);
          r = mat3_mul(rot_z_mat3(pi / 2 + (params.left_pedal_angle || 0)), r);

          gl.draw_mesh("Pedal", mat4_mul(mvp, mat), mat3_mul(rot, r));


          mat = mat4_mul(mat, scale_mat4([5, 46, 5]));
          mat = mat4_mul(translation_mat4([0, 0, 7]), mat);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: hex_to_color("#888888") });


          mat = rot_y_mat4(pi / 2);
          mat = mat4_mul(rot_x_mat4(pi / 2), mat);
          mat = mat4_mul(rot_z_mat4(crank_angle + pi / 2 + (params.right_pedal_angle || 0)), mat);
          mat = mat4_mul(translation_mat4([0, crank_length, pedal_offset]), mat);
          mat = mat4_mul(rot_z_mat4(-crank_angle), mat);
          mat = mat4_mul(translation_mat4(vec_add(sprocket_fem_offset, sprocket)), mat);

          r = rot_y_mat3(pi / 2);
          r = mat3_mul(rot_x_mat3(pi / 2), r);
          r = mat3_mul(rot_z_mat3(pi / 2 + (params.right_pedal_angle || 0)), r);

          gl.draw_mesh("Pedal", mat4_mul(mvp, mat), mat3_mul(rot, r));

          mat = mat4_mul(mat, scale_mat4([5, 46, 5]));
          mat = mat4_mul(translation_mat4([0, 0, -7]), mat);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: hex_to_color("#888888") });
        }

        let sad = sin(steer_axis_angle - base_steer_axis_angle);


        {
          let mat = rot_y_mat4(pi / 2);
          mat = mat4_mul(rot_z_mat4(-2 + (fork_offset - 40) * 0.003), mat);
          mat = mat4_mul(translation_mat4(front), mat);
          mat = mat4_mul(translation_mat4([0, 0, -front_dropout_width / 2]), mat);
          mat = mat4_mul(steer_mat, mat);

          let r = rot_y_mat3(pi / 2);
          r = mat3_mul(rot_z_mat3(pi), r);

          gl.draw_mesh("Dropout_front", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: frame_color });

          mat = mat4_mul(mat, translation_mat4([-front_dropout_width, 0, 0]));

          gl.draw_mesh("Dropout_front", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: frame_color });
        }


        {
          let mat = rot_y_mat4(pi / 2);
          mat = mat4_mul(rot_x_mat4(-pi / 2), mat);
          mat = mat4_mul(rot_z_mat4(0.25), mat);
          mat = mat4_mul(translation_mat4(node_position("front_bottom")), mat);
          mat = mat4_mul(steer_mat, mat);


          let r = rot_y_mat3(pi / 2);
          r = mat3_mul(rot_x_mat3(-pi / 2), r);


          gl.draw_mesh("Front_lugs", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: frame_color });

          mat = mat4_mul(mat, rot_x_mat4(pi));

          gl.draw_mesh("Front_lugs", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: frame_color });
        }

        {
          let pp = vec_add(front_up, vec_scale(steer_axis, 100));

          let mat = translation_mat4([-700, 0, -0]);
          mat = mat4_mul(rot_x_mat4(-pi / 2), mat);
          mat = mat4_mul(rot_y_mat4(pi / 2), mat);
          mat = mat4_mul(rot_z_mat4(-pi / 2), mat);
          mat = mat4_mul(translation_mat4([pp[0] + 100, pp[1], -19]), mat);

          let r = rot_x_mat3(-pi / 2);
          r = mat3_mul(rot_y_mat3(pi / 2), r);
          r = mat3_mul(rot_z_mat3(-pi / 2), r);

          gl.draw_mesh("Steering_clamp", mat4_mul(mvp, mat4_mul(steer_mat, mat)), mat3_mul(rot, r));


          mat = mat4_mul(z_flip_mat4, mat);
          r = mat3_mul(z_flip_mat3, r);
          gl.draw_mesh("Steering_clamp", mat4_mul(mvp, mat4_mul(steer_mat, mat)), mat3_mul(rot, r));

          mat = mat4_mul(mat, y_flip_mat4);
          r = mat3_mul(r, y_flip_mat3);
          gl.draw_mesh("Steering_clamp", mat4_mul(mvp, mat4_mul(steer_mat, mat)), mat3_mul(rot, r));

          mat = mat4_mul(z_flip_mat4, mat);
          r = mat3_mul(z_flip_mat3, r);
          gl.draw_mesh("Steering_clamp", mat4_mul(mvp, mat4_mul(steer_mat, mat)), mat3_mul(rot, r));
        }

        {
          let pp = vec_add(front_up, vec_scale(steer_axis, 110));

          let mat = translation_mat4([-700, 0, -0]);
          mat = mat4_mul(rot_x_mat4(-pi / 2), mat);
          mat = mat4_mul(rot_z_mat4(pi - steer_axis_angle), mat);
          mat = mat4_mul(translation_mat4([pp[0], pp[1], 0]), mat);

          let r = rot_x_mat3(-pi / 2);
          r = mat3_mul(rot_z_mat3(pi - steer_axis_angle), r);

          gl.draw_mesh("Steering_clamp", mat4_mul(mvp, mat4_mul(steer_mat, mat)), mat3_mul(rot, r));


          mat = mat4_mul(z_flip_mat4, mat);
          r = mat3_mul(z_flip_mat3, r);
          gl.draw_mesh("Steering_clamp", mat4_mul(mvp, mat4_mul(steer_mat, mat)), mat3_mul(rot, r));

          mat = mat4_mul(mat, translation_mat4([681, 0, -0]));
          mat = mat4_mul(mat, x_flip_mat4);
          mat = mat4_mul(mat, translation_mat4([-681, 0, -0]));

          r = mat3_mul(r, x_flip_mat3);
          gl.draw_mesh("Steering_clamp", mat4_mul(mvp, mat4_mul(steer_mat, mat)), mat3_mul(rot, r));
          mat = mat4_mul(z_flip_mat4, mat);
          r = mat3_mul(z_flip_mat3, r);
          gl.draw_mesh("Steering_clamp", mat4_mul(mvp, mat4_mul(steer_mat, mat)), mat3_mul(rot, r));
        }

        {
          let pp = vec_add(front_up, vec_scale(steer_axis, 38));

          let mat = scale_mat4([17.5, 2, 17.5]);
          mat = mat4_mul(rot_z_mat4(pi / 2 - steer_axis_angle), mat);
          mat = mat4_mul(translation_mat4([pp[0], pp[1], 0]), mat);
          mat = mat4_mul(steer_mat, mat);

          let r = rot_z_mat3(pi / 2 - steer_axis_angle);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: hex_to_color("#777777") });


          pp = vec_add(front_up, vec_scale(steer_axis, -117.5));

          mat = scale_mat4([17.5, 2, 17.5]);
          mat = mat4_mul(rot_z_mat4(pi / 2 - steer_axis_angle), mat);
          mat = mat4_mul(translation_mat4([pp[0], pp[1], 0]), mat);
          mat = mat4_mul(steer_mat, mat);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: hex_to_color("#777777") });


          pp = vec_add(front_up, vec_scale(steer_axis, 55));

          mat = scale_mat4([15, 14, 15]);
          mat = mat4_mul(rot_z_mat4(pi / 2 - steer_axis_angle), mat);
          mat = mat4_mul(translation_mat4([pp[0], pp[1], 0]), mat);
          mat = mat4_mul(steer_mat, mat);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r));

          pp = vec_add(front_up, vec_scale(steer_axis, 103));

          mat = scale_mat4([13, 10, 13]);
          mat = mat4_mul(rot_z_mat4(pi / 2 - steer_axis_angle), mat);
          mat = mat4_mul(translation_mat4([pp[0], pp[1], 0]), mat);
          mat = mat4_mul(steer_mat, mat);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r));
        }


        for (let i = 0; i < 2; i++) {
          let mat = translation_mat4([-380, 0, -0]);
          mat = mat4_mul(rot_x_mat4(-pi / 2), mat);
          mat = mat4_mul(rot_y_mat4(pi / 2), mat);
          mat = mat4_mul(rot_z_mat4(0.2), mat);
          mat = mat4_mul(translation_mat4([1056 + sad * 100, 500 + sad * 28, 210 * (i ? 1 : -1)]), mat);

          mat = mat4_mul(steer_mat, mat);


          let angle = (params.brake_angles && params.brake_angles[i]) || 0;


          let r = rot_x_mat3(-pi / 2);
          r = mat3_mul(rot_y_mat3(pi / 2), r);

          gl.draw_mesh("Brake_body", mat4_mul(mvp, mat), mat3_mul(rot, r));

          gl.draw_mesh("Brake_handle", mat4_mul(mvp, mat4_mul(mat, rot_x_mat4(-angle))), mat3_mul(rot, r));


          mat = mat4_mul(mat, translation_mat4([380, 0, -0]));
          mat = mat4_mul(mat, x_flip_mat4);
          mat = mat4_mul(mat, translation_mat4([-380, 0, -0]));

          r = mat3_mul(r, x_flip_mat3);

          gl.draw_mesh("Brake_body", mat4_mul(mvp, mat), mat3_mul(rot, r));
          gl.draw_mesh("Brake_handle", mat4_mul(mvp, mat4_mul(mat, rot_x_mat4(-angle))), mat3_mul(rot, r));

          mat = scale_mat4([3, 16.5, 3]);
          mat = mat4_mul(rot_x_mat4(pi / 2), mat);
          mat = mat4_mul(translation_mat4([1056 + sad * 100, 500 + sad * 28, 210 * (i ? 1 : -1)]), mat);

          mat = mat4_mul(steer_mat, mat);

          r = rot_x_mat3(pi / 2);

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: hex_to_color("#cccccc") });


          mat = scale_mat4([2.5, 12, 2.5]);
          mat = mat4_mul(rot_x_mat4(pi / 2), mat);
          mat = mat4_mul(translation_mat4([-8.5, 12, 0]), mat);
          mat = mat4_mul(rot_z_mat4(angle), mat)
          mat = mat4_mul(translation_mat4([1056 + sad * 100, 500 + sad * 28, 210 * (i ? 1 : -1)]), mat);

          mat = mat4_mul(steer_mat, mat);

          r = mat3_mul(rot_z_mat3(angle), rot_x_mat3(pi / 2));

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: hex_to_color("#cccccc") });
        }


        {

          let angle = (params.brake_angles && params.brake_angles[0]) || 0;
          angle *= 19 / 71;
          let mat = translation_mat4([468, 0, -25]);
          mat = mat4_mul(rot_x_mat4(-pi / 2), mat);
          mat = mat4_mul(rot_z_mat4(0.28), mat);
          mat = mat4_mul(translation_mat4(node_position("front_bottom")), mat);

          mat = mat4_mul(steer_mat, mat);


          let r = rot_x_mat3(-pi / 2);
          r = mat3_mul(rot_z_mat3(0.28), r);

          gl.draw_mesh("Brake_back", mat4_mul(mvp, mat), mat3_mul(rot, r));



          {
            let mat = translation_mat4([859.5, 334.5, 0]);
            mat = mat4_mul(mat, rot_z_mat4(0.28 + pi / 2));
            mat = mat4_mul(mat, scale_mat4([6, 3, 6]));

            mat = mat4_mul(steer_mat, mat);

            let r = rot_x_mat3(0.28 + pi / 2);

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: models_colors["Brake_back"] });
          }

          {
            let mm = mat;
            mm = mat4_mul(mm, translation_mat4([0, -25, 0]));
            mm = mat4_mul(mm, rot_x_mat4(-angle));
            mm = mat4_mul(mm, translation_mat4([0, 25, 0]));


            gl.draw_mesh("Brake_mid", mat4_mul(mvp, mm), mat3_mul(rot, r));


            gl.draw_mesh("Brake_pad", mat4_mul(mvp, mm), mat3_mul(rot, r));
          }

          {
            let mm = mat;
            mm = mat4_mul(mm, translation_mat4([0, 25, 0]));
            mm = mat4_mul(mm, rot_x_mat4(angle));
            mm = mat4_mul(mm, translation_mat4([0, -25, 0]));
            gl.draw_mesh("Brake_front", mat4_mul(mvp, mm), mat3_mul(rot, r));

            let k = mm;
            k = mat4_mul(k, translation_mat4([0, -48, 0]));
            k = mat4_mul(k, rot_x_mat4(-angle * 2.9));
            k = mat4_mul(k, translation_mat4([0, 48, 0]));
            gl.draw_mesh("Brake_clamp", mat4_mul(mvp, k), mat3_mul(rot, r));

            mm = mat4_mul(mm, y_flip_mat4);
            r = mat3_mul(r, y_flip_mat3);

            gl.draw_mesh("Brake_pad", mat4_mul(mvp, mm), mat3_mul(rot, r));
          }









        }

        let cable_color = [0.3, 0.3, 0.3, 1.0];
        let steel_cable_color = [0.9, 0.9, 0.9, 1.0];



        {
          let mat = steer_mat;

          let r = 2.4;
          let p = vec_add(front_up, vec_scale(steer_axis, 100));
          p[0] += 100;
          let sign = 1;

          gl.draw_bezier(mat4_mul(mvp, mat), rot, [
            vec_add(p, [14, 0, -70]),
            vec_add(p, [14, 0, -60]),
            vec_add(p, [10, -14, -12]),
            vec_add(p, [0, -50, 0]),
          ], r, [], false, cable_color);

          let angle = (params.brake_angles && params.brake_angles[0]) || 0;

          let p0 = [-3 - sad * 250, -190, 46.5 - angle * 12];
          let p1 = [15 - sad * 240 + angle * 10, -250 - angle * 20, 48 + angle * 10];

          gl.draw_bezier(mat4_mul(mvp, mat), rot, [
            vec_add(p, [0, -50, 0]),
            vec_add(p, [-10, -86, 12]),
            vec_add(p, [-20 - sad * 150, -120, 46 - angle * 6]),
            vec_add(p, p0),
          ], r, [], false, cable_color);

          let ll = vec_len(vec_sub(p1, p0));

          gl.draw_bezier(mat4_mul(mvp, mat), rot, [
            vec_add(p, p1),
            vec_add(p, vec_lerp(p1, p0, 1 / 3)),
            vec_add(p, vec_lerp(p1, p0, 2 / 3)),
            vec_add(p, p0),
          ], 0.75, [4 * pi, ll * 2], true, steel_cable_color);
        }

        if (!params.fem)

        {
          let mat = steer_mat;

          let r = 2.4;
          let p = vec_add(front_up, vec_scale(steer_axis, 100));
          p[0] += 100;
          let sign = 1;

          gl.draw_bezier(mat4_mul(mvp, mat), rot, [
            vec_add(p, [14, 0, 70]),
            vec_add(p, [14, 0, 30]),
            vec_add(p, [70, -10, 0]),
            vec_add(p, [50, -50, -30]),
          ], r, [], false, cable_color);

          let ppp = [20, -100, -30 - steer_angle * 20];

          gl.draw_bezier(mat4_mul(mvp, mat), rot, [
            vec_add(p, [50, -50, -30]),
            vec_add(p, [30, -90, -60]),
            vec_add(p, ppp),
            vec_add(p, [-30, -100, -30]),
          ], r, [], false, cable_color);

          let p0 = mat4_mul_vec3(steer_mat, vec_add(p, [-30, -100, -30]));
          let p1 = mat4_mul_vec3(steer_mat, vec_add(p, ppp));
          mat = ident_mat4;

          gl.draw_bezier(mat4_mul(mvp, mat), rot, [
            p0,
            vec_add(p0, vec_sub(p0, p1)),
            vec_add(p, [-120, -97, -17]),
            vec_add(p, [-160, -97, -17]),
          ], r, [], false, cable_color);

          gl.draw_bezier(mat4_mul(mvp, mat), rot, [
            p0,
            vec_add(p0, vec_sub(p0, p1)),
            vec_add(p, [-120, -97, -17]),
            vec_add(p, [-160, -97, -17]),
          ], r, [], false, cable_color);

          gl.draw_bezier(mat4_mul(mvp, mat), rot, [
            vec_add(p, [-160, -97, -17]),
            vec_add(p, [-260, -97, -17]),
            vec_add(p, [-360, -97, -17]),
            vec_add(p, [-560, -97, -17]),
          ], r, [], false, cable_color);


          p0 = [-725, -205, -46];
          p1 = [-755, -265, -46];
          gl.draw_bezier(mat4_mul(mvp, mat), rot, [
            vec_add(p, [-560, -97, -17]),
            vec_add(p, [-620, -97, -17]),
            vec_add(p, [-670, -97, -46]),
            vec_add(p, p0),
          ], r, [], false, cable_color);

          let ll = vec_len(vec_sub(p1, p0));


          gl.draw_bezier(mat4_mul(mvp, mat), rot, [
            vec_add(p, p1),
            vec_add(p, vec_lerp(p1, p0, 1 / 3)),
            vec_add(p, vec_lerp(p1, p0, 2 / 3)),
            vec_add(p, p0),
          ], 0.75, [4 * pi, ll * 2], true, steel_cable_color);
        }

        if (!params.fem)

        {
          let mat = translation_mat4([475, 0, -25]);
          mat = mat4_mul(rot_x_mat4(-pi / 2), mat);
          mat = mat4_mul(rot_z_mat4(0.45), mat);
          mat = mat4_mul(rot_y_mat4(pi), mat);
          mat = mat4_mul(translation_mat4([185, 310, 0]), mat);


          let r = rot_x_mat3(-pi / 2);
          r = mat3_mul(rot_z_mat3(0.45), r);
          r = mat3_mul(rot_y_mat3(pi), r);

          gl.draw_mesh("Brake_front", mat4_mul(mvp, mat), mat3_mul(rot, r));
          gl.draw_mesh("Brake_clamp", mat4_mul(mvp, mat), mat3_mul(rot, r));

          gl.draw_mesh("Brake_mid", mat4_mul(mvp, mat), mat3_mul(rot, r));
          gl.draw_mesh("Brake_back", mat4_mul(mvp, mat), mat3_mul(rot, r));

          {
            let mat = translation_mat4([162.5, 317, 0]);
            mat = mat4_mul(mat, rot_z_mat4(-0.45 + pi / 2));
            mat = mat4_mul(mat, scale_mat4([6, 5.5, 6]));

            let r = rot_x_mat3(-0.45 + pi / 2);

            gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: models_colors["Brake_back"] });
          }


          gl.draw_mesh("Brake_pad", mat4_mul(mvp, mat), mat3_mul(rot, r));

          mat = mat4_mul(mat, y_flip_mat4);
          r = mat3_mul(r, y_flip_mat3);

          gl.draw_mesh("Brake_pad", mat4_mul(mvp, mat), mat3_mul(rot, r));
        }


        {

          let mat = mat4_mul(rot_y_mat4(pi / 2), rot_x_mat4(params.rear_wheel_angle || 0));
          let r = mat3_mul(rot_y_mat3(pi / 2), rot_x_mat3(params.rear_wheel_angle || 0));

          if (params.wheel_separation)
            mat = mat4_mul(translation_mat4([0, -params.wheel_separation, 0]), mat);

          draw_wheel(mat4_mul(mvp, mat), mat3_mul(rot, r), false, true);

          mat = mat4_mul(rot_y_mat4(pi / 2), rot_x_mat4(params.front_wheel_angle || 0));
          mat = mat4_mul(translation_mat4(front), mat);
          mat = mat4_mul(steer_mat, mat);

          r = mat3_mul(rot_y_mat3(pi / 2), rot_x_mat3(params.front_wheel_angle || 0));

          if (params.wheel_separation)
            mat = mat4_mul(translation_mat4([0, -params.wheel_separation, 0]), mat);


          draw_wheel(mat4_mul(mvp, mat), mat3_mul(rot, r), false, true);
        }


        if (!params.fem) {

          let mat = translation_mat4([-740, 0, 0]);
          mat = mat4_mul(rot_y_mat4(-pi / 2), mat);
          mat = mat4_mul(rot_x_mat4(-pi / 2), mat);
          mat = mat4_mul(rot_z_mat4(-pi / 2 + seat_axis_angle), mat);
          mat = mat4_mul(translation_mat4(vec_add(seat, vec_scale(seat_axis, 20))), mat);


          let r = rot_y_mat3(-pi / 2);
          r = mat3_mul(rot_x_mat3(-pi / 2), r);
          r = mat3_mul(rot_z_mat3(-pi / 2 + seat_axis_angle), r);


          gl.draw_mesh("Seat_clamp", mat4_mul(mvp, mat), mat3_mul(rot, r), [0.3, 0.3, 0.3, 1]);


          mat = mat4_mul(z_flip_mat4, mat);
          r = mat3_mul(z_flip_mat3, r);

          gl.draw_mesh("Seat_clamp", mat4_mul(mvp, mat), mat3_mul(rot, r), [0.3, 0.3, 0.3, 1]);

        }

        {

          let mat = translation_mat4([600, 0, 0]);
          mat = mat4_mul(rot_y_mat4(pi / 2), mat);
          mat = mat4_mul(rot_z_mat4(-pi / 2), mat);
          mat = mat4_mul(translation_mat4(seat), mat);
          mat = mat4_mul(translation_mat4([-39, 95, 0]), mat);

          let fem_mat = ident_mat4;
          if (params.fem) {

            fem_mat = translation_mat4(vec_neg(seat_top2));
            fem_mat = mat4_mul(rot_z_mat4(params.fem.seat_a), fem_mat);
            fem_mat = mat4_mul(translation_mat4(seat_top2), fem_mat);
            fem_mat = mat4_mul(translation_mat4(params.fem.seat), fem_mat);
          }

          let r = mat3_mul(rot_z_mat3(-pi / 2), rot_y_mat3(pi / 2));

          gl.draw_mesh("Seat_bottom", mat4_mul(mvp, mat4_mul(fem_mat, mat)), mat3_mul(rot, r), [0.3, 0.3, 0.3, 1]);
          gl.draw_mesh("Seat_top", mat4_mul(mvp, mat4_mul(fem_mat, mat)), mat3_mul(rot, r), [0.3, 0.3, 0.3, 1]);



          mat = mat4_mul(z_flip_mat4, mat);
          r = mat3_mul(z_flip_mat3, r);

          gl.draw_mesh("Seat_bottom", mat4_mul(mvp, mat4_mul(fem_mat, mat)), mat3_mul(rot, r), [0.3, 0.3, 0.3, 1]);
          gl.draw_mesh("Seat_top", mat4_mul(mvp, mat4_mul(fem_mat, mat)), mat3_mul(rot, r), [0.3, 0.3, 0.3, 1]);

          mat = translation_mat4(seat);
          mat = mat4_mul(translation_mat4([-39, 95, 0]), mat);

          if (params.fem) {

            mat = mat4_mul(translation_mat4(vec_neg(seat_top2)), mat);
            mat = mat4_mul(rot_z_mat4(params.fem.seat_a), mat);
            mat = mat4_mul(translation_mat4(seat_top2), mat);
            mat = mat4_mul(translation_mat4(params.fem.seat), mat);
          }


          gl.draw_bezier(mat4_mul(mvp, mat), rot, [
            [140, 20, 8],
            [90, 20, 8],
            [30, 0, 21],
            [0, 0, 21],
          ], 3.5, [], false, [0.8, 0.8, 0.8, 1]);

          gl.draw_bezier(mat4_mul(mvp, mat), rot, [
            [140, 20, -8],
            [90, 20, -8],
            [30, 0, -21],
            [0, 0, -21],
          ], 3.5, [], false, [0.8, 0.8, 0.8, 1]);

          gl.draw_bezier(mat4_mul(mvp, mat), rot, [
            [-110, 30, 50],
            [-100, 30, 50],
            [-30, 0, 21],
            [0, 0, 21],
          ], 3.5, [], false, [0.8, 0.8, 0.8, 1]);

          gl.draw_bezier(mat4_mul(mvp, mat), rot, [
            [-110, 30, -50],
            [-100, 30, -50],
            [-30, 0, -21],
            [0, 0, -21],
          ], 3.5, [], false, [0.8, 0.8, 0.8, 1]);
        }


        {

          let mat = scale_mat4(0.086);
          mat = mat4_mul(rot_y_mat4(-pi / 2), mat);
          mat = mat4_mul(translation_mat4(seat), mat);
          mat = mat4_mul(translation_mat4([-30, 110, 0]), mat);

          if (params.fem) {

            mat = mat4_mul(translation_mat4(vec_neg(seat_top2)), mat);
            mat = mat4_mul(rot_z_mat4(params.fem.seat_a), mat);
            mat = mat4_mul(translation_mat4(seat_top2), mat);
            mat = mat4_mul(translation_mat4(params.fem.seat), mat);
          }

          let r = rot_y_mat3(-pi / 2);

          gl.draw_mesh("Seat", mat4_mul(mvp, mat), mat3_mul(rot, r), [0.3, 0.3, 0.3, 1]);

          mat = mat4_mul(mat, x_flip_mat4);
          r = mat3_mul(r, x_flip_mat3);

          gl.draw_mesh("Seat", mat4_mul(mvp, mat), mat3_mul(rot, r), [0.3, 0.3, 0.3, 1]);
        }

        let sprocket_offset = 45; {

          let mat = rot_z_mat4(-crank_angle);
          mat = mat4_mul(translation_mat4(vec_add(sprocket_fem_offset, sprocket)), mat);
          mat = mat4_mul(translation_mat4([0, 0, sprocket_offset]), mat);

          let r = rot_z_mat3(-crank_angle);



          gl.draw_simple_mesh("front_sprocket", mat4_mul(mvp, mat), mat3_mul(rot, r), [0.3, 0.3, 0.3, 1]);

          mat = mat4_mul(mat, rot_y_mat4(pi / 2));
          r = mat3_mul(r, rot_y_mat3(pi / 2));
          mat = mat4_mul(mat, rot_x_mat4(-0.3));
          r = mat3_mul(r, rot_x_mat3(-0.3));

          for (let i = 0; i < 5; i++) {
            gl.draw_mesh("Sprocket", mat4_mul(mvp, mat), mat3_mul(rot, r), {
              color: [0.3, 0.3, 0.3, 1]
            });
            gl.draw_mesh("Crank_sprocket", mat4_mul(mvp, mat4_mul(translation_mat4([0, 0, 4]), mat)), mat3_mul(rot, r));
            mat = mat4_mul(mat, rot_x_mat4(2 * pi / 5));
            r = mat3_mul(r, rot_x_mat3(2 * pi / 5));
          }

        }

        {

          let rear_sprocket_color = hex_to_color("#888888");
          let mat = rot_z_mat4(-crank_angle * gear_ratio);
          mat = mat4_mul(translation_mat4(rear), mat);
          mat = mat4_mul(translation_mat4([0, 0, sprocket_offset]), mat);

          let r = rot_z_mat3(-crank_angle * gear_ratio);



          gl.draw_simple_mesh("rear_sprocket", mat4_mul(mvp, mat), mat3_mul(rot, r), rear_sprocket_color);

          mat = mat4_mul(mat, rot_x_mat4(pi / 2));
          mat = mat4_mul(mat, scale_mat4([32, 2, 32]));

          r = mat3_mul(r, rot_x_mat3(pi / 2));

          gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: rear_sprocket_color });
        }


        if (!params.fem) {
          let offset = crank_angle * front_sprocket_R * 2 / 25.4 + 0.7;
          let d = vec_sub(sprocket, rear);

          let mat = rot_z_mat4(atan2(d[1], d[0]));
          mat = mat4_mul(translation_mat4(sprocket), mat);
          mat = mat4_mul(translation_mat4([0, 0, sprocket_offset]), mat);

          gl.draw_chain(mat4_mul(mvp, mat), rot, offset);

        }
      }


      function draw_wheel(mvp, rot, radial = false, base = false) {

        let hub_rotation_angle = radial ? 0 : -1;

        let hub_rot = rot_x_mat3(hub_rotation_angle);

        draw_hub(mat4_mul(mvp, mat3_to_mat4(hub_rot)), mat3_mul(rot, hub_rot), { base: base });
        draw_rim(mvp, rot, { base: base });

        if (radial)
          draw_radial_spokes(mvp, rot, { hub_rot: hub_rot, base: base })
        else
          draw_tangential_spokes(mvp, rot, { hub_rot: hub_rot, base: base })

        gl.draw_simple_mesh("torus", mvp, rot, [0.2, 0.2, 0.2, 1]);

        let mat = rot_z_mat4(pi / 2);
        mat = mat4_mul(mat, scale_mat4([4, 70, 4]));

        let r = rot_z_mat3(pi / 2);

        gl.draw_mesh("Cylinder", mat4_mul(mvp, mat), mat3_mul(rot, r), { color: [0.8, 0.8, 0.8, 1] });


      }



      function draw_spoke(mvp, rot, l, bend = [0, 0], thread = false, color = models_colors["Spoke"]) {

        if (!thread)
          l += spoke_thread_L;

        if (bend[0] != 0 && bend[1] != 0) {
          gl.draw_flex_tube(mat4_mul(mvp, translation_mat4([0, 0, spoke_knee_R])), rot, color, l - spoke_knee_R - spoke_thread_L, bend);
        } else {
          let mat = scale_mat4([1, 1, l - spoke_knee_R - spoke_thread_L]);
          mat = mat4_mul(translation_mat4([0, 0, spoke_knee_R]), mat);
          gl.draw_simple_mesh("tube", mat4_mul(mvp, mat), rot, color);
        }

        gl.draw_simple_mesh("knee", mvp, rot, color);
        if (thread)
          gl.draw_thread(mat4_mul(mvp, translation_mat4([0, 0, l - spoke_thread_L])), rot, color);
      }

      function draw_hub_simple(mvp, rot, params = {}) {
        
        params.instances = 32;
     gl.draw_mesh("Hub_simple_hole", mvp, rot, params);
     gl.draw_mesh("Hub_simple_hole", mat4_mul(mvp, x_flip_mat4), mat3_mul(rot, x_flip_mat3), params);
      }

      function draw_hub(mvp, rot, params = {}) {

        let d = params.width || hub_width;

        {
          let mat = scale_mat4([10, 10, d]);
          mat = mat4_mul(rot_y_mat4(pi / 2), mat);
          mat = mat4_mul(translation_mat4([-d / 2, 0, 0]), mat);
          let r = rot_y_mat3(pi / 2);

          gl.draw_simple_mesh("tube", mat4_mul(mvp, mat), mat3_mul(rot, r), models_colors[params.base ? "Base_Hub_simple_hole" : "Hub_simple_hole"]);

        }


        params.instances = 16;

          let mat = mat4_mul(mvp, rot_x_mat4(pi/16));
          let r = mat3_mul(rot, rot_x_mat3(pi/16));

          gl.draw_mesh("Hub_simple_hole", mat4_mul(mat, translation_mat4([d / 2, 0, 0])), r, params);
          gl.draw_mesh("Hub_simple_hole", mat4_mul(mat4_mul(mat, translation_mat4([d / 2, 0, 0])), x_flip_mat4), mat3_mul(r, x_flip_mat3), params);
          

          gl.draw_mesh("Hub_simple_fin", mat4_mul(mat, translation_mat4([d / 2, 0, 0])), r, params);
          gl.draw_mesh("Hub_simple_fin", mat4_mul(mat4_mul(mat, translation_mat4([d / 2, 0, 0])), x_flip_mat4), mat3_mul(r, x_flip_mat3), params);

          mat = mat4_mul(mat, rot_x_mat4(pi / 16));
          r = mat3_mul(r, rot_x_mat3(pi / 16));

          gl.draw_mesh("Hub_simple_hole", mat4_mul(mat, translation_mat4([-d / 2, 0, 0])), r, params);
          gl.draw_mesh("Hub_simple_hole", mat4_mul(mat4_mul(mat, translation_mat4([-d / 2, 0, 0])), x_flip_mat4), mat3_mul(r, x_flip_mat3), params);

          gl.draw_mesh("Hub_simple_fin", mat4_mul(mat, translation_mat4([-d / 2, 0, 0])), r, params);
          gl.draw_mesh("Hub_simple_fin", mat4_mul(mat4_mul(mat, translation_mat4([-d / 2, 0, 0])), x_flip_mat4), mat3_mul(r, x_flip_mat3), params);
      }

      function draw_rim(mvp, rot, params = {}) {
        
        if (params.shader === "deflect") {
        for (let i = 0; i < 32; i++) {
          let x_rot = (i + 0.5) / 32 * 2 * pi;

          let mat = mat4_mul(mvp, rot_x_mat4(x_rot));
          let r = mat3_mul(rot, rot_x_mat3(x_rot));

            mat = mvp;
            params.m_pos = rot_x_mat3(-x_rot);
            
          gl.draw_mesh("Rim", mat, r, params);
          gl.draw_mesh("Rim_pad", mat, r, params);

            params.m_pos = mat3_mul(x_flip_mat3, rot_x_mat3(-x_rot));
            gl.draw_mesh("Rim", mat, mat3_mul(r, x_flip_mat3), params);
            gl.draw_mesh("Rim_pad", mat, mat3_mul(r, x_flip_mat3), params);
            
            }
          } else {
            
            params.instances = 32;
            
            gl.draw_mesh("Rim", mvp, rot, params);
            gl.draw_mesh("Rim_pad", mvp, rot, params);
            gl.draw_mesh("Rim", mat4_mul(mvp, x_flip_mat4), mat3_mul(rot, x_flip_mat3), params);
            gl.draw_mesh("Rim_pad", mat4_mul(mvp, x_flip_mat4), mat3_mul(rot, x_flip_mat3), params);
          }
      }



      function draw_tangential_spokes(mvp, rot, options = {}) {

        let width = options.hub_width || hub_width;
        let rim_mat = options.rim_mat || ident_mat4;
        let hub_rot = options.hub_rot || ident_mat3;

        for (let i = 0; i < n_spokes; i++) {

          let active = i & 1 ? (i & 2) == 0 : (i & 2) == 2;

          let side0 = i & 1 ? 1 : -1;
          let side1 = i & 2 ? 1 : -1;
          let a = i * 2 * pi / n_spokes;

          let p0 = [side0 * (hub_width / 2 - side1 * side0 * spoke_knee_R), cos(a) * hub_R, sin(a) * hub_R];
          p0 = mat3_mul_vec(hub_rot, p0);

          a -= 3 / 8 * 2 * pi * active;


          let p1 = [0, cos(a) * rim_inner_R, sin(a) * rim_inner_R];
          p1 = mat4_mul_vec3(rim_mat, p1).slice(0, 3);

          let spoke_vector = vec_sub(p1, p0);

          a = atan2(spoke_vector[2], spoke_vector[1]);


          let l = vec_len(spoke_vector);

          let tilt = Math.asin(spoke_vector[0] / l);

          let mat = rot_z_mat4(i & 2 ? pi : 0);
          mat = mat4_mul(rot_y_mat4(tilt), mat);
          mat = mat4_mul(rot_x_mat4(a - pi / 2), mat);
          mat = mat4_mul(translation_mat4(p0), mat);
          mat = mat4_mul(mvp, mat);

          let r = rot_z_mat3(i & 2 ? pi : 0);
          r = mat3_mul(rot_y_mat3(tilt), r);
          r = mat3_mul(rot_x_mat3(a - pi / 2), r);
          r = mat3_mul(rot, r);

          let spoke_color = options.coloring ? options.coloring(i) : undefined;
          draw_spoke(mat, r, l, [0, 0], false, spoke_color);

          let base_mat = mat;
          let base_r = r;

          mat = mat4_mul(mat, rot_x_mat4(pi / 2));
          mat = mat4_mul(mat, translation_mat4([0, l - 13, 0]));
          mat = mat4_mul(mat, rot_z_mat4(pi));


          r = mat3_mul(r, rot_x_mat3(pi / 2));
          r = mat3_mul(r, rot_z_mat3(pi));

          gl.draw_mesh("Nipple", mat, r, options.base ? { base: true } : undefined);

          if (options.nipple_arrow_rotation !== undefined) {

            mat = mat4_mul(mat, rot_y_mat4(options.nipple_arrow_rotation));
            r = mat3_mul(r, rot_y_mat3(options.nipple_arrow_rotation));

            let m = mat;
            m = mat4_mul(m, translation_mat4([0, -5, 0]));


            gl.draw_simple_mesh("nipple_arrow", m, r, models_colors["Nipple_arrow"]);

            m = mat4_mul(m, rot_z_mat4(-pi));
            m = mat4_mul(m, rot_y_mat4(pi * 3 / 4));

            r = mat3_mul(r, rot_z_mat3(-pi));
            r = mat3_mul(r, rot_y_mat3(pi * 3 / 4));

            gl.draw_simple_mesh("nipple_arrow", m, r, models_colors["Nipple_arrow"]);
          }

          let arrow_size = options.force_size ? options.force_size(i) : 0;
          arrow_size *= 0.7;
          if (arrow_size) {
            let mat = base_mat;
            let r = base_r;
            let tr = i
            mat = mat4_mul(mat, translation_mat4([0, 0, 30]));
            gl.draw_arrow(mat4_mul(mat, scale_mat4(arrow_size)), r);


            mat = mat4_mul(mat, translation_mat4([0, 0, l - 50]));
            mat = mat4_mul(mat, rot_x_mat4(pi));
            gl.draw_arrow(mat4_mul(mat, scale_mat4(arrow_size)), r);
          }
        }
      }


      function draw_radial_spokes(mvp, rot, options = {}) {

        let width = options.hub_width || hub_width;
        let rim_mat = options.rim_mat || ident_mat4;
        let hub_rot = options.hub_rot || ident_mat3;
        let flip = options.flip;
        let draw_count = options.draw_count || 32;

        for (let i = 0; i < draw_count; i++) {

          let side0 = i & 1 ? 1 : -1;
          let side1 = i & 2 ? 1 : -1;

          if (flip) {
            side0 = -side0;
            side1 = 0;
          }

          let a = i * 2 * pi / 32;

          let p0 = [side0 * (width / 2 - side1 * side0 * spoke_knee_R), cos(a) * hub_R, sin(a) * hub_R];
          p0 = mat3_mul_vec(hub_rot, p0);

          let p1 = [0, cos(a) * rim_inner_R, sin(a) * rim_inner_R];
          p1 = mat4_mul_vec3(rim_mat, p1).slice(0, 3);

          let spoke_vector = vec_sub(p1, p0);

          a = atan2(spoke_vector[2], spoke_vector[1]);
          let l = vec_len(spoke_vector);

          let tilt = Math.asin(spoke_vector[0] / l);

          let rot_z = i & 2 ? pi : 0;

          if (flip)
            rot_z = i & 1 ? pi : 0;

          let mat = rot_z_mat4(rot_z);
          mat = mat4_mul(rot_y_mat4(tilt), mat);
          mat = mat4_mul(rot_x_mat4(a - pi / 2), mat);
          mat = mat4_mul(translation_mat4(p0), mat);
          mat = mat4_mul(mvp, mat);

          let r = rot_z_mat3(rot_z);
          r = mat3_mul(rot_y_mat3(tilt), r);
          r = mat3_mul(rot_x_mat3(a - pi / 2), r);
          r = mat3_mul(rot, r);


          if (options.coloring)
            draw_spoke(mat, r, l, undefined, undefined, options.coloring(i));
          else
            draw_spoke(mat, r, l);


          mat = mat4_mul(mat, rot_x_mat4(pi / 2));
          mat = mat4_mul(mat, translation_mat4([0, l - 14, 0]));
          mat = mat4_mul(mat, rot_z_mat4(pi));

          r = mat3_mul(r, rot_x_mat3(pi / 2));
          r = mat3_mul(r, rot_z_mat3(pi));

          gl.draw_mesh("Nipple", mat, r);

        }
      }

      function draw_zoom(r0, r1, p0, p1) {
        let diff = vec_sub(p1, p0);
        let a = Math.atan2(-diff[0], diff[1]);

        ctx.save();
        ctx.translate(p0[0], p0[1]);
        ctx.rotate(a);



        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(50,50,50,0.6)";

        ctx.setLineDash([2, 3]);

        var d = vec_len(diff);

        var cos = (r1 - r0) / d;
        var sin = Math.sqrt(1 - cos * cos);


        ctx.beginPath();
        ctx.moveTo(-sin * r1, d - r1 * cos);
        ctx.lineTo(-sin * r0, -r0 * cos);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(sin * r1, d - r1 * cos);
        ctx.lineTo(sin * r0, -r0 * cos);
        ctx.stroke();

        ctx.strokeStyle = "rgba(50,50,50,0.9)";

        ctx.setLineDash([]);
        ctx.lineWidth = 1.0;

        ctx.beginPath();
        ctx.ellipse(0, d, r1, r1, 0, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#555";

        ctx.beginPath();
        ctx.ellipse(0, 0, r0, r0, 0, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.restore();
      }

    }

    if (args.animated)
      this.set_paused(false);

    if (args.has_text)
      document.fonts.load("10px IBM Plex Sans").then(function() { request_repaint(true); });

    window.addEventListener("resize", this.on_resize, true);
    window.addEventListener("load", this.on_resize, true);

    this.on_resize();
  }


  document.addEventListener("DOMContentLoaded", function(event) {

    if (!localStorage.getItem("global.metric")) {
      let language = window.navigator.userLanguage || window.navigator.language;
      if (language == "en_US" || language == "en-US") {
        metric = false;
      }
    } else {
      metric = localStorage.getItem("global.metric") === "true";
    }

    if (!metric)
      document.body.classList.add("show_imperial");


    function make_drawer(name, args = {}, slider_count = 0, slider_values = [0.5, 0.5, 0.5]) {
      let ret = {};

      let drawer_container = document.getElementById(name);
      let drawer = new Drawer(drawer_container, name, args);
      ret.drawer = drawer;

      ret.sliders = [];

      for (let i = 0; i < slider_count; i++) {
        let slider = new Slider(document.getElementById(name + "_sl" + i), function(x) {
          drawer.set_slider_arg(i, x);
        }, undefined, slider_values[i]);

        ret.sliders.push(slider);

        if (args.sim_slider !== undefined && args.sim_slider == i)
          drawer.set_sim_slider(slider);
      }

      if (args.has_reset) {
        drawer.set_reset_callback(function() {
          for (let i = 0; i < slider_count; i++) {
            drawer.set_slider_arg(i, slider_values[i])
            ret.sliders[i].set_value(slider_values[i]);
          }
        })
      }

      return ret;
    }


    make_drawer("hero", { simulated: true, animated: true, has_two_axis: true }, 1, [0.5]);

    make_drawer("force1", { simulated: true, has_reset: true }, 1, [0]);
    make_drawer("force2", { simulated: true, has_reset: true }, 1, [0]);
    make_drawer("force3", { simulated: true, has_reset: true, sim_slider: 0 }, 1, [0.5]);
    make_drawer("force4", {}, 1, [0]);
    make_drawer("force5", {}, 1, [0]);
    make_drawer("force5b", {}, 1, [0]);
    make_drawer("force5a", { simulated: true }, 1, [0]);
    make_drawer("force6", {}, 1, [0]);
    make_drawer("force7", {}, 1, [0]);
    make_drawer("force8", { simulated: true, has_reset: true }, 1, [0]);
    make_drawer("force9", { simulated: true, has_reset: true }, 1, [0]);
    make_drawer("force10", { simulated: true, has_reset: true }, 1, [0.5]);
    make_drawer("force11", {}, 1, [0]);
    make_drawer("force12", { simulated: true, has_reset: true });
    make_drawer("force13", {}, 1, [0]);

    make_drawer("bike_force1", { animated: true }, 1, [0.6]);
    make_drawer("bike_force2", { animated: true }, 1, [0.6]);
    make_drawer("bike_force3", { simulated: true }, 1, [0.6]);
    make_drawer("bike_force4", { animated: true });

    make_drawer("bike_force_pedal", { simulated: true, animated: true });
    bike_force_longitudinal = make_drawer("bike_force_longitudinal", { simulated: true, animated: true }, 1, [0]);

    make_drawer("bike_force_longitudinal2", { simulated: true, animated: true }, 1, [0]);

    make_drawer("bike_force_lateral", { simulated: true, has_reset: true, sim_slider: 0 }, 1, [0.5]);
    make_drawer("bike_force_lateral2", { simulated: true, has_reset: true }, 1, [0.5]);


    make_drawer("bike_force_tangent", { has_two_axis: true }, 1, [0.5]);
    make_drawer("bike_force_handlebars", {}, 1, [0.0]);
    make_drawer("bike_force_handlebars2", { has_two_axis: true }, 1, [0.0]);
    bike_force_cornering = make_drawer("bike_force_cornering", { animated: true, has_two_axis: true });
    make_drawer("bike_force_cornering_intro", { animated: true, has_two_axis: true });
    make_drawer("bike_force_cornering2", { has_two_axis: true }, 1, [0.0]);
    make_drawer("bike_force_cornering3", { has_two_axis: true }, 1, [0.0]);
    make_drawer("bike_force_cornering4", { has_two_axis: true }, 1, [0.0]);
    make_drawer("bike_force_cornering5", { has_two_axis: true }, 1, [0.0]);
    make_drawer("bike_force_stability", { has_two_axis: true }, 1, [0.0]);
    make_drawer("bike_force_stability2", { has_two_axis: true }, 1, [0.0]);
    make_drawer("bike_force_stability3", { has_two_axis: true }, 1, [0.0]);

    make_drawer("bike_force_brake_rear", { simulated: true, has_reset: true }, 1, [0]);
    make_drawer("bike_force_brake_front", { simulated: true, has_reset: true }, 1, [0]);
    make_drawer("bike_force_brake_front2", { simulated: true, has_reset: true }, 1, [0]);

    make_drawer("bike_force_front_flip", {}, 1, [0]);
    make_drawer("bike_force_normal_rotation", {}, 1, [0]);

    make_drawer("bike_force_wheels", { animated: true }, 1);
    make_drawer("bike_force_wheels2", { animated: true }, 1);

    wheel_velocity1 = make_drawer("wheel_velocity1", { animated: true }, 2, [0.5, 0.5]);
    wheel_velocity2 = make_drawer("wheel_velocity2", { animated: true }, 2, [0.5, 0.5]);

    make_drawer("tire_force", {}, 1, [0]);
    make_drawer("tire_force3", {}, 1, [0]);
    make_drawer("tire_force4", {}, 1, [0]);

    make_drawer("wheel", {
      has_arcball: true,
      rotation: mat3_mul(rot_y_mat3(0.9), rot_x_mat3(pi))
    });

    let fem_mat = mat3_mul(rot_x_mat3(0.4), rot_y_mat3(-3.7));
    let fem_mat2 = mat3_mul(rot_x_mat3(0.5), rot_y_mat3(-5.7));

    make_drawer("fem1", { has_arcball: true, has_units: true, rotation: fem_mat }, 1);
    make_drawer("fem2", { has_arcball: true, has_units: true, rotation: fem_mat }, 2, [0, 0]);
    fem3 = make_drawer("fem3", { has_arcball: true, has_units: true, rotation: fem_mat }, 2, [0.5, 0.2]);
    fem4 = make_drawer("fem4", { has_arcball: true, has_units: true, rotation: fem_mat }, 2, [0.5, 0.0]);
    make_drawer("fem5", { has_arcball: true, has_units: true, rotation: fem_mat2 }, 1, [0]);
    fem6 = make_drawer("fem6", { has_arcball: true, has_units: true, rotation: fem_mat2 }, 2);
    fem7 = make_drawer("fem7", { has_arcball: true, has_units: true, rotation: fem_mat2 }, 3);
    make_drawer("fem8", {
      has_arcball: true,
      has_units: true,
      rotation: mat3_mul(rot_y_mat3(-0.5), rot_x_mat3(0.4))
    }, 1, [0]);
    make_drawer("fem9", {
      has_arcball: true,
      has_units: true,
      rotation: mat3_mul(rot_x_mat3(0.0), rot_y_mat3(pi))
    }, 2, [0.5, 0]);

    let bending_mat = mat3_mul(rot_y_mat3(-0.5), rot_x_mat3(1.8));


    let bending1 = make_drawer("bending1", { has_arcball: true, rotation: bending_mat }, 1, [0]);
    bending3 = make_drawer("bending3", { has_arcball: true, rotation: bending_mat }, 2, [0, 0.5]);
    make_drawer("bending4", { has_arcball: true, rotation: bending_mat }, 1, [0]);
    make_drawer("bending5", { has_arcball: true, rotation: bending_mat }, 2, [0, 0.5]);
    make_drawer("bending6", { has_arcball: true, rotation: bending_mat }, 2, [0, 0]);

    let torsion_mat = mat3_mul(rot_y_mat3(-2.4), rot_x_mat3(1.2));


    make_drawer("torsion1", { has_arcball: true, rotation: torsion_mat }, 1, [0]);
    make_drawer("torsion2", { has_arcball: true, rotation: torsion_mat }, 1, [0]);
    make_drawer("torsion3", { has_arcball: true, rotation: torsion_mat }, 2, [0.5, 0]);
    torsion4 = make_drawer("torsion4", { has_arcball: true }, 2);


    new SegmentedControl(document.getElementById("bending1_seg0"), function(x) {
      bending1.drawer.set_slider_arg(1, x);
    }, ["steel", "titanium", "aluminum"]);

    make_drawer("bending2", {}, 1, [0]);
    make_drawer("beam_forces", {}, 2);

    make_drawer("slip_angle", { has_two_axis: true }, 2, [0, 0]);
    make_drawer("slip_angle2", { has_two_axis: true }, 2, [0, 0]);

    make_drawer("bike_pedal", {
      has_arcball: true,
      rotation: mat3_mul(rot_y_mat3(0.4), rot_x_mat3(-0.1))
    }, 1, [0]);
    make_drawer("bike_pedal2", {}, 1, [0]);
    make_drawer("bike_pedal3", {}, 1, [0]);

    make_drawer("bike_brake", {
      has_arcball: true,
      rotation: mat3_mul(rot_y_mat3(-2.3), rot_x_mat3(-0.2))

    }, 1, [0]);

    make_drawer("bike_caster", {
      has_arcball: true,
      rotation: mat3_mul(rot_y_mat3(-2.2), rot_x_mat3(-0.2))

    }, 1, [0]);

    make_drawer("bike_caster2", {
      has_arcball: true,
      rotation: mat3_mul(rot_y_mat3(-1), rot_x_mat3(0.0))

    }, 1, [0]);


    make_drawer("bike_frame", { has_arcball: true, rotation: rot_y_mat3(pi) });
    make_drawer("bike_frame2", { has_arcball: true, rotation: rot_y_mat3(pi) });
    make_drawer("bike_frame3", { has_arcball: true, rotation: rot_y_mat3(pi) });

    make_drawer("wheel_carriage_assembly", { has_arcball: true }, 1, [0]);
    make_drawer("wheel_carriage_load", { rotation: rot_y_mat3(pi / 2) }, 1, [0]);
    make_drawer("wheel_carriage_buckle", {
      has_arcball: true,
      rotation: mat3_mul(rot_y_mat3(0.9), rot_x_mat3(0))

    }, 1, [0]);
    make_drawer("wheel_spokes_assembly", { has_arcball: true }, 1, [0]);
    make_drawer("wheel_spokes_assembly2", { has_arcball: true }, 1, [0]);
    make_drawer("wheel_spokes_assembly3", { has_arcball: true }, 1, [0]);

    make_drawer("wheel_spoke", {
      has_two_axis: true,
      rotation: rot_x_mat3(-pi / 2)
    });


    make_drawer("wheel_spoke_forces", {
      rotation: ident_mat3
    }, 1, 0.5);

    make_drawer("spoke_buckling", {}, 1, [0]);
    spoke_pushing = make_drawer("spoke_pushing", { has_text: true, has_units: true }, 2);
    make_drawer("spoke_pulling", { has_text: true, has_units: true }, 2);

    make_drawer("contact_patch", { has_arcball: true, rotation: mat3_mul(rot_x_mat3(0.3), mat3_mul(rot_y_mat3(1), rot_z_mat3(pi))) }, 1, [0]);
    make_drawer("pacejka", {}, 1);
    make_drawer("pacejka2", {}, 1);

    make_drawer("bike_trail", {}, 2, [0.5, 0.5]);
    make_drawer("gyro", {
      has_arcball: true,
      simulated: true,
      has_reset: true,
      rotation: mat3_mul(rot_y_mat3(0.7), rot_x_mat3(0.2)),

      sim_slider: 0
    }, 1);
    make_drawer("gyro2", {
      has_arcball: true,
      simulated: true,
      has_reset: true,
      rotation: mat3_mul(rot_y_mat3(0.7), rot_x_mat3(0.2)),
      sim_slider: 0
    }, 1);

    make_drawer("bending_moment", {}, 1);
    make_drawer("bending_force", {
      has_arcball: true,
      rotation: bending_mat,

    }, 1);

    wheel_spokes_lat_length = make_drawer("wheel_spokes_lat_length", { rotation: mat3_mul(rot_y_mat3(pi - 3 * pi / 32), rot_z_mat3(pi / 2)) }, 2, [0, 0]);


    make_drawer("wheel_grabber", { rotation: rot_y_mat3(pi / 2), tracks_drags: true, simulated: true, has_reset: true });

    make_drawer("wheel_spokes_1", { rotation: rot_y_mat3(pi / 2) }, 1, [0]);
    make_drawer("wheel_spokes_6", { has_arcball: true }, 1, [0]);
    make_drawer("wheel_spokes_7", { rotation: rot_y_mat3(pi / 2) }, 1);
    make_drawer("wheel_spokes_8", { rotation: rot_y_mat3(pi / 2) }, 1);
    make_drawer("wheel_spokes_action", { has_arcball: true }, 1, [0]);

    make_drawer("wheel_spokes_9", { has_arcball: true }, 1, [0.0]);
    make_drawer("wheel_spokes_10", { has_arcball: true }, 1, [0.0]);
    make_drawer("wheel_spokes_11", { has_arcball: true }, 1, [0.0]);
    make_drawer("wheel_spokes_12", { has_arcball: true }, 1, [0.0]);
    make_drawer("wheel_spokes_13", {
      has_arcball: true,
      rotation: mat3_mul(rot_x_mat3(0.2), rot_y_mat3(1.2)),

    }, 1, [0.0]);
    make_drawer("wheel_spokes_14", { has_arcball: true }, 1, [0.0]);
    make_drawer("wheel_spokes_15", { has_arcball: true }, 1, [0.0]);

    make_drawer("wheel_spokes_lat1", {
      has_arcball: true,
      simulated: true,
      rotation: mat3_mul(rot_y_mat3(0.5), rot_x_mat3(0.3))

    }, 1, [0]);
    wheel_spokes_lat2 = make_drawer("wheel_spokes_lat2", {
      has_arcball: true,
      simulated: true,
      rotation: mat3_mul(rot_y_mat3(0.5), rot_x_mat3(0.3))
    }, 2, [0]);

    make_drawer("wheel_spokes_force_radius1", { rotation: rot_y_mat3(pi / 2) }, 1, [0.5]);
    make_drawer("wheel_spokes_force_radius2", { rotation: rot_y_mat3(pi / 2) }, 1, [0]);

    let grads = document.getElementsByClassName("gradient_word");
    for (let span of grads) {
      let str = span.innerText;
      let n = str.length;
      let c0 = hex_to_color(span.dataset.color0);
      let c1 = hex_to_color(span.dataset.color1);
      span.innerText = ""

      for (var i = 0; i < n; i++) {
        let c = vec_lerp(c0, c1, i / (n - 1));

        let letter = document.createElement("span");
        letter.style.color = rgba_color_string(c);
        letter.innerText = str.charAt(i);
        span.appendChild(letter);
      }

    }


    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          entry.target.drawer.set_visible(entry.isIntersecting);
        });
      }, { rootMargin: "300px" })

      all_containers.forEach(container => observer.observe(container));
    } else {
      all_containers.forEach(container => container.drawer.set_visible(true));
    }


  });
})();


function gauss_jordan(A, b, n) {

  A = A.slice();
  b = b.slice();

  for (let step = 0; step < n; step++) {

    let max = 0;
    let max_row = 0;

    for (let i = step; i < n; i++) {
      let val = A[i * n + step];
      if (Math.abs(val) > Math.abs(max)) {
        max = val;
        max_row = i;
      }
    }

    let inv = 1 / max;

    b[max_row] *= inv;

    let temp = b[max_row];
    b[max_row] = b[step];
    b[step] = temp;

    for (let j = 0; j < n; j++) {
      A[max_row * n + j] *= inv;
      let temp = A[max_row * n + j];
      A[max_row * n + j] = A[step * n + j];
      A[step * n + j] = temp;
    }

    for (let i = 0; i < n; i++) {

      if (i == step)
        continue;

      let val = A[i * n + step];

      b[i] -= val * b[step];

      for (let j = step; j < n; j++) {
        A[i * n + j] -= val * A[step * n + j];
      }
    }
  }

  return b;
}

function sigma_string(pa) {
  if (metric)
    return (pa * 1e-6).toFixed(1) + " MPa";
  else
    return (pa * 1e-6 * 145.03773773).toFixed(0) + " psi";
}

function weight_string(kg) {
  if (metric)
    return (kg).toFixed(2) + " kg";
  else
    return (kg / 0.45359237).toFixed(2) + " lb";
}


function switch_units() {
  metric = !metric;

  localStorage.setItem("global.metric", metric ? "true" : "false");

  if (metric)
    document.body.classList.remove("show_imperial");
  else
    document.body.classList.add("show_imperial");

  units_drawers.forEach(drawer => drawer.request_repaint());
}

function wheel_velocity1_f0() {
  wheel_velocity1.drawer.set_slider_arg(0, 0.8);
  wheel_velocity1.drawer.set_slider_arg(1, 0.2);
  wheel_velocity1.sliders[0].set_value(0.8);
  wheel_velocity1.sliders[1].set_value(0.2);
}

function wheel_velocity1_f1() {
  wheel_velocity1.drawer.set_slider_arg(0, 0.2);
  wheel_velocity1.drawer.set_slider_arg(1, 0.8);
  wheel_velocity1.sliders[0].set_value(0.2);
  wheel_velocity1.sliders[1].set_value(0.8);
}

function wheel_velocity1_f2() {
  wheel_velocity1.drawer.set_slider_arg(0, 0.3);
  wheel_velocity1.drawer.set_slider_arg(1, 0.3);
  wheel_velocity1.sliders[0].set_value(0.3);
  wheel_velocity1.sliders[1].set_value(0.3);
}


function wheel_velocity1_f3() {
  wheel_velocity1.drawer.set_slider_arg(0, 0.9);
  wheel_velocity1.drawer.set_slider_arg(1, 0.9);
  wheel_velocity1.sliders[0].set_value(0.9);
  wheel_velocity1.sliders[1].set_value(0.9);
}


function wheel_velocity2_f0() {
  let a = wheel_velocity2.drawer.slider_arg(0);
  wheel_velocity2.drawer.set_slider_arg(1, a);
  wheel_velocity2.sliders[1].set_value(a);
}


function wheel_velocity2_f1() {
  wheel_velocity2.drawer.set_slider_arg(0, 0.5);
  wheel_velocity2.drawer.set_slider_arg(1, 0.7);
  wheel_velocity2.sliders[0].set_value(0.5);
  wheel_velocity2.sliders[1].set_value(0.7);
}

function wheel_velocity2_f2() {
  wheel_velocity2.drawer.set_slider_arg(0, 0.6);
  wheel_velocity2.drawer.set_slider_arg(1, 0.4);
  wheel_velocity2.sliders[0].set_value(0.6);
  wheel_velocity2.sliders[1].set_value(0.4);
}

function wheel_velocity2_f3() {
  wheel_velocity2.drawer.set_slider_arg(0, 0.0);
  wheel_velocity2.drawer.set_slider_arg(1, 0.1);
  wheel_velocity2.sliders[0].set_value(0.0);
  wheel_velocity2.sliders[1].set_value(0.1);
}

function bike_force_longitudinal_f0() {
  bike_force_longitudinal.drawer.set_slider_arg(0, 1.0);
  bike_force_longitudinal.sliders[0].set_value(1.0);
}

function bike_force_cornering_f0() {
  bike_force_cornering.drawer.set_angles([-Math.PI * 3 / 2, -1.66]);
}

function bike_force_cornering_f1() {
  bike_force_cornering.drawer.set_angles([-Math.PI * 3 / 2, 0]);
}

function wheel_spokes_lat_length_f0() {
  wheel_spokes_lat_length.drawer.set_slider_arg(0, 0.8);
  wheel_spokes_lat_length.sliders[0].set_value(0.8);

  wheel_spokes_lat_length.drawer.set_slider_arg(1, 0.9);
  wheel_spokes_lat_length.sliders[1].set_value(0.9);
}

function wheel_spokes_lat_length_f1() {
  wheel_spokes_lat_length.drawer.set_slider_arg(0, 0.8);
  wheel_spokes_lat_length.sliders[0].set_value(0.8);

  wheel_spokes_lat_length.drawer.set_slider_arg(1, 0.1);
  wheel_spokes_lat_length.sliders[1].set_value(0.1);
}

function wheel_spokes_lat2_f0() {
  wheel_spokes_lat2.drawer.set_slider_arg(1, 0.9);
  wheel_spokes_lat2.sliders[1].set_value(0.9);
}


function bending3_f0() {
  bending3.drawer.set_slider_arg(0, 0.9);
  bending3.sliders[0].set_value(0.9);

  bending3.drawer.set_slider_arg(1, 0.9);
  bending3.sliders[1].set_value(0.9);
}

function bending3_f1() {
  bending3.drawer.set_slider_arg(0, 0.9);
  bending3.sliders[0].set_value(0.9);

  bending3.drawer.set_slider_arg(1, 0.1);
  bending3.sliders[1].set_value(0.1);
}

function spoke_pushing_f0() {
  spoke_pushing.drawer.set_slider_arg(0, 0.9);
  spoke_pushing.sliders[0].set_value(0.9);

  spoke_pushing.drawer.set_slider_arg(1, 0.9);
  spoke_pushing.sliders[1].set_value(0.9);
}


function spoke_pushing_f1() {
  spoke_pushing.drawer.set_slider_arg(0, 0.9);
  spoke_pushing.sliders[0].set_value(0.9);

  spoke_pushing.drawer.set_slider_arg(1, 0.1);
  spoke_pushing.sliders[1].set_value(0.1);
}


function fem3_f0() {
  fem3.drawer.set_slider_arg(0, 1);
  fem3.sliders[0].set_value(1);
}

function fem3_f1() {
  fem3.drawer.set_slider_arg(1, 0.8);
  fem3.sliders[1].set_value(0.8);
}


function fem4_f0() {
  fem4.drawer.set_slider_arg(1, 0.9);
  fem4.sliders[1].set_value(0.9);
}

function fem6_f0() {
  fem6.drawer.set_slider_arg(0, 0);
  fem6.sliders[0].set_value(0);
}

function fem6_f1() {
  fem6.drawer.set_slider_arg(0, 1);
  fem6.sliders[0].set_value(1);
}

function fem7_f0() {
  fem7.drawer.set_slider_arg(2, 1);
  fem7.sliders[2].set_value(1);
}

function fem7_f1() {
  fem7.drawer.set_slider_arg(2, 1);
  fem7.sliders[2].set_value(1);
  fem7.drawer.set_slider_arg(0, 1);
  fem7.sliders[0].set_value(1);
}

function fem7_f2() {
  fem7.drawer.set_slider_arg(2, 1);
  fem7.sliders[2].set_value(1);
  fem7.drawer.set_slider_arg(0, 0);
  fem7.sliders[0].set_value(0);
}

function torsion4_f0() {
  torsion4.drawer.set_slider_arg(0, 1);
  torsion4.sliders[0].set_value(1);

  torsion4.drawer.set_slider_arg(1, 0.0);
  torsion4.sliders[1].set_value(0.0);

  torsion4.drawer.set_rot(rot_y_mat3(0.3));
}


function torsion4_f1() {
  torsion4.drawer.set_slider_arg(0, 1);
  torsion4.sliders[0].set_value(1);

  torsion4.drawer.set_slider_arg(1, 1);
  torsion4.sliders[1].set_value(1);

  torsion4.drawer.set_rot(rot_y_mat3(0.3));
}