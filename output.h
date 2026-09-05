#ifndef OUTPUT_H_GENERATED_
#define OUTPUT_H_GENERATED_

#include "wasm-rt.h"

#include <stdint.h>

#ifndef WASM_RT_CORE_TYPES_DEFINED
#define WASM_RT_CORE_TYPES_DEFINED
typedef uint8_t u8;
typedef int8_t s8;
typedef uint16_t u16;
typedef int16_t s16;
typedef uint32_t u32;
typedef int32_t s32;
typedef uint64_t u64;
typedef int64_t s64;
typedef float f32;
typedef double f64;
#endif

#ifdef __cplusplus
extern "C" {
#endif

struct w2c_a;

typedef struct w2c_scichart2d {
  struct w2c_a* w2c_a_instance;
  u32 w2c_g0;
  u32 w2c_g1;
  wasm_rt_memory_t w2c_lb;
  wasm_rt_funcref_table_t w2c_qb;
} w2c_scichart2d;

void wasm2c_scichart2d_instantiate(w2c_scichart2d*, struct w2c_a*);
void wasm2c_scichart2d_free(w2c_scichart2d*);
wasm_rt_func_type_t wasm2c_scichart2d_get_func_type(uint32_t param_count, uint32_t result_count, ...);

/* import: 'a' '$' */
u32 w2c_a_0x24(struct w2c_a*, u32, u32, u32);

/* import: 'a' '$a' */
u32 w2c_a_0x24a(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'A' */
void w2c_a_A(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'Aa' */
void w2c_a_Aa(struct w2c_a*, u32);

/* import: 'a' 'B' */
void w2c_a_B(struct w2c_a*, u32, u32, u32, u32, u32, u32, u32, u32);

/* import: 'a' 'Ba' */
u32 w2c_a_Ba(struct w2c_a*);

/* import: 'a' 'C' */
void w2c_a_C(struct w2c_a*, u32, u32);

/* import: 'a' 'Ca' */
void w2c_a_Ca(struct w2c_a*, u32);

/* import: 'a' 'D' */
void w2c_a_D(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'Da' */
void w2c_a_Da(struct w2c_a*, u32, u32);

/* import: 'a' 'E' */
void w2c_a_E(struct w2c_a*, u32, u32, u32, u32, u32);

/* import: 'a' 'Ea' */
void w2c_a_Ea(struct w2c_a*, u32, u32);

/* import: 'a' 'F' */
void w2c_a_F(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'Fa' */
void w2c_a_Fa(struct w2c_a*, u32, u32);

/* import: 'a' 'G' */
void w2c_a_G(struct w2c_a*, u32);

/* import: 'a' 'Ga' */
void w2c_a_Ga(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'H' */
void w2c_a_H(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'Ha' */
void w2c_a_Ha(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'I' */
u32 w2c_a_I(struct w2c_a*, u32);

/* import: 'a' 'Ia' */
void w2c_a_Ia(struct w2c_a*, u32, u32, u32, u32, u32, u32, u32);

/* import: 'a' 'J' */
u32 w2c_a_J(struct w2c_a*, u32, u32);

/* import: 'a' 'Ja' */
void w2c_a_Ja(struct w2c_a*, u32);

/* import: 'a' 'K' */
u32 w2c_a_K(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'Ka' */
void w2c_a_Ka(struct w2c_a*, f32, f32, f32, f32);

/* import: 'a' 'L' */
u32 w2c_a_L(struct w2c_a*, u32);

/* import: 'a' 'La' */
void w2c_a_La(struct w2c_a*, u32);

/* import: 'a' 'M' */
void w2c_a_M(struct w2c_a*, u32, u32);

/* import: 'a' 'Ma' */
void w2c_a_Ma(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'N' */
void w2c_a_N(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'Na' */
void w2c_a_Na(struct w2c_a*, u32);

/* import: 'a' 'O' */
void w2c_a_O(struct w2c_a*, u32);

/* import: 'a' 'Oa' */
void w2c_a_Oa(struct w2c_a*, u32);

/* import: 'a' 'P' */
void w2c_a_P(struct w2c_a*, u32, u32);

/* import: 'a' 'Pa' */
void w2c_a_Pa(struct w2c_a*, u32);

/* import: 'a' 'Q' */
void w2c_a_Q(struct w2c_a*, u32);

/* import: 'a' 'Qa' */
void w2c_a_Qa(struct w2c_a*, u32);

/* import: 'a' 'R' */
void w2c_a_R(struct w2c_a*, u32, u32);

/* import: 'a' 'Ra' */
void w2c_a_Ra(struct w2c_a*, u32);

/* import: 'a' 'S' */
void w2c_a_S(struct w2c_a*, u32, u32);

/* import: 'a' 'Sa' */
u32 w2c_a_Sa(struct w2c_a*);

/* import: 'a' 'T' */
u32 w2c_a_T(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'Ta' */
void w2c_a_Ta(struct w2c_a*, u32);

/* import: 'a' 'U' */
u32 w2c_a_U(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'Ua' */
void w2c_a_Ua(struct w2c_a*, f32, f32, f32, f32);

/* import: 'a' 'V' */
u32 w2c_a_V(struct w2c_a*, u32);

/* import: 'a' 'Va' */
void w2c_a_Va(struct w2c_a*, u32);

/* import: 'a' 'W' */
void w2c_a_W(struct w2c_a*);

/* import: 'a' 'Wa' */
void w2c_a_Wa(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'X' */
void w2c_a_X(struct w2c_a*, u32);

/* import: 'a' 'Xa' */
u32 w2c_a_Xa(struct w2c_a*, u32, u32, u32, u32, u32);

/* import: 'a' 'Y' */
void w2c_a_Y(struct w2c_a*, u32, u32);

/* import: 'a' 'Ya' */
u32 w2c_a_Ya(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'Z' */
void w2c_a_Z(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'Za' */
void w2c_a_Za(struct w2c_a*, u32, u32, u32, u32, u32, u32, u32);

/* import: 'a' '_' */
void w2c_a_0x5F(struct w2c_a*, u32, u32);

/* import: 'a' '_a' */
u32 w2c_a_0x5Fa(struct w2c_a*, u32, u32, u32, u32, u32);

/* import: 'a' 'a' */
void w2c_a_a(struct w2c_a*, u32, u32, u32, u32, u32, u32, u32, u32, u32, u32);

/* import: 'a' 'aa' */
void w2c_a_aa(struct w2c_a*, u32);

/* import: 'a' 'ab' */
u32 w2c_a_ab(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'b' */
void w2c_a_b(struct w2c_a*, u32, u32, u32, u32, u32, u32, u32, u32, u32, u32);

/* import: 'a' 'ba' */
void w2c_a_ba(struct w2c_a*, u32);

/* import: 'a' 'bb' */
void w2c_a_bb(struct w2c_a*);

/* import: 'a' 'c' */
void w2c_a_c(struct w2c_a*, u32, u32, u32, u32, u32, u32, u32, u32, u32, u32, u32, u32, u32);

/* import: 'a' 'ca' */
u32 w2c_a_ca(struct w2c_a*);

/* import: 'a' 'cb' */
u32 w2c_a_cb(struct w2c_a*, u32);

/* import: 'a' 'd' */
void w2c_a_d(struct w2c_a*, u32, u32, u32, u32, u32, u32);

/* import: 'a' 'da' */
void w2c_a_da(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'db' */
void w2c_a_db(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'e' */
void w2c_a_e(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'ea' */
void w2c_a_ea(struct w2c_a*, u32, u32, u32, u32, u32);

/* import: 'a' 'eb' */
u32 w2c_a_eb(struct w2c_a*, u32, u32);

/* import: 'a' 'f' */
void w2c_a_f(struct w2c_a*, u32, u32, u32, u32, u32, u32, u32, u32, u32);

/* import: 'a' 'fa' */
void w2c_a_fa(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'fb' */
u32 w2c_a_fb(struct w2c_a*, u32, u32);

/* import: 'a' 'g' */
void w2c_a_g(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'ga' */
void w2c_a_ga(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'gb' */
u32 w2c_a_gb(struct w2c_a*, u32, u32);

/* import: 'a' 'h' */
void w2c_a_h(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'ha' */
u32 w2c_a_ha(struct w2c_a*);

/* import: 'a' 'hb' */
u32 w2c_a_hb(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'i' */
void w2c_a_i(struct w2c_a*, u32, u32, u32, u32, u32, u32, u32, u32);

/* import: 'a' 'ia' */
void w2c_a_ia(struct w2c_a*, u32, u32);

/* import: 'a' 'ib' */
u32 w2c_a_ib(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'j' */
void w2c_a_j(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'ja' */
void w2c_a_ja(struct w2c_a*, u32, u32, u32, u32, u32, u32);

/* import: 'a' 'jb' */
u32 w2c_a_jb(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'k' */
void w2c_a_k(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'ka' */
void w2c_a_ka(struct w2c_a*, u32);

/* import: 'a' 'kb' */
void w2c_a_kb(struct w2c_a*, u32);

/* import: 'a' 'l' */
void w2c_a_l(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'la' */
void w2c_a_la(struct w2c_a*, u32, u32);

/* import: 'a' 'm' */
void w2c_a_m(struct w2c_a*, u32, u32);

/* import: 'a' 'ma' */
void w2c_a_ma(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'n' */
void w2c_a_n(struct w2c_a*, u32, u32, u32, u32, u32, u32, u32, u32, u32);

/* import: 'a' 'na' */
void w2c_a_na(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'o' */
void w2c_a_o(struct w2c_a*, u32, u32, u32, u32, u32);

/* import: 'a' 'oa' */
void w2c_a_oa(struct w2c_a*, u32);

/* import: 'a' 'p' */
void w2c_a_p(struct w2c_a*, u32, u32);

/* import: 'a' 'pa' */
void w2c_a_pa(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'q' */
void w2c_a_q(struct w2c_a*, u32, u32);

/* import: 'a' 'qa' */
u32 w2c_a_qa(struct w2c_a*, u32);

/* import: 'a' 'r' */
u32 w2c_a_r(struct w2c_a*, u32, u32);

/* import: 'a' 'ra' */
void w2c_a_ra(struct w2c_a*, u32);

/* import: 'a' 's' */
void w2c_a_s(struct w2c_a*, u32, u32);

/* import: 'a' 'sa' */
void w2c_a_sa(struct w2c_a*, u32, u32);

/* import: 'a' 't' */
u32 w2c_a_t(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'ta' */
void w2c_a_ta(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'u' */
f64 w2c_a_u(struct w2c_a*, u32, u32, u32, u32, u32);

/* import: 'a' 'ua' */
void w2c_a_ua(struct w2c_a*, u32, u32, u32);

/* import: 'a' 'v' */
u32 w2c_a_v(struct w2c_a*, u32);

/* import: 'a' 'va' */
u32 w2c_a_va(struct w2c_a*, u32, u32);

/* import: 'a' 'w' */
void w2c_a_w(struct w2c_a*, u32, u32, u32, u32);

/* import: 'a' 'wa' */
void w2c_a_wa(struct w2c_a*);

/* import: 'a' 'x' */
void w2c_a_x(struct w2c_a*, u32, u32);

/* import: 'a' 'xa' */
void w2c_a_xa(struct w2c_a*, u32, u32, u32, u32, u32, u32, u32);

/* import: 'a' 'y' */
void w2c_a_y(struct w2c_a*, u32);

/* import: 'a' 'ya' */
u32 w2c_a_ya(struct w2c_a*, u32, u32);

/* import: 'a' 'z' */
void w2c_a_z(struct w2c_a*, u32);

/* import: 'a' 'za' */
void w2c_a_za(struct w2c_a*, u32, u32, u32, u32);

/* export: 'lb' */
wasm_rt_memory_t* w2c_scichart2d_lb(w2c_scichart2d* instance);

/* export: 'mb' */
void w2c_scichart2d_mb(w2c_scichart2d*);

/* export: 'nb' */
u32 w2c_scichart2d_nb(w2c_scichart2d*, u32);

/* export: 'ob' */
void w2c_scichart2d_ob(w2c_scichart2d*, u32);

/* export: 'pb' */
u32 w2c_scichart2d_pb(w2c_scichart2d*, u32);

/* export: 'qb' */
wasm_rt_funcref_table_t* w2c_scichart2d_qb(w2c_scichart2d* instance);

/* export: 'rb' */
void w2c_scichart2d_rb(w2c_scichart2d*, u32, u32, u32);

/* export: 'sb' */
void w2c_scichart2d_sb(w2c_scichart2d*, u32, u32, u32);

/* export: 'tb' */
u32 w2c_scichart2d_tb(w2c_scichart2d*, u32, u32);

/* export: 'ub' */
void w2c_scichart2d_ub(w2c_scichart2d*, u32, u32);

/* export: 'vb' */
void w2c_scichart2d_vb(w2c_scichart2d*, u32);

/* export: 'wb' */
u32 w2c_scichart2d_wb(w2c_scichart2d*, u32);

/* export: 'xb' */
u32 w2c_scichart2d_xb(w2c_scichart2d*);

/* export: 'yb' */
u32 w2c_scichart2d_yb(w2c_scichart2d*, u32, u32, u32, u32, u32);

/* export: 'zb' */
void w2c_scichart2d_zb(w2c_scichart2d*, u32, u32, u32, u32, u32, u32, u32);

/* export: 'Ab' */
u32 w2c_scichart2d_Ab(w2c_scichart2d*, u32, u32, u32, u32, u32, u32, u32);

/* export: 'Bb' */
u32 w2c_scichart2d_Bb(w2c_scichart2d*, u32, u32, u32, u32, u32, u32, u32, u32, u32);

/* export: 'Cb' */
u32 w2c_scichart2d_Cb(w2c_scichart2d*, u32, u32, u32, u32, u32, u32, u32, u32, u32, u32);

#ifdef __cplusplus
}
#endif

#endif  /* OUTPUT_H_GENERATED_ */
