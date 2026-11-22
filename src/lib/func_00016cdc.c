#include "common/mus_voice.h"

typedef double f64;
typedef struct {
    u32 w0;
    u32 w1;
} Acmd;

u32 osVirtualToPhysical(void *addr);
Acmd *func_000177b0(N_PVoice *e, s16 *outp, Acmd *p);
s16 func_00016efc(f64 vol, f64 tgt, s32 count, u16 *ratel);
extern s16 D_800A9D40[];
Acmd *func_00016cdc(void *filter, s16 *inp, s16 *outp, s32 outCount, Acmd *p);
Acmd *func_00016cdc(void *filter, s16 *inp, s16 *outp, s32 outCount, Acmd *p) {
    Acmd *ptr = p;
    N_PVoice *e = filter;
    if (e->em_motion != 1 || !outCount) {
        return ptr;
    }
    ptr = func_000177b0(e, inp, p);
    if (e->em_first) {
        e->em_first = 0;
        e->em_ltgt = (e->em_volume * D_800A9D40[e->em_pan]) >> 15;
        e->em_lratm = func_00016efc((f64)e->em_cvolL, (f64)e->em_ltgt, e->em_segEnd, &e->em_lratl);
        e->em_rtgt = (e->em_volume * D_800A9D40[128 - e->em_pan - 1]) >> 15;
        e->em_rratm = func_00016efc((f64)e->em_cvolR, (f64)e->em_rtgt, e->em_segEnd, &e->em_rratl);
        { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(9) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(0) & ((0x01 << (8)) - 1)) << (16))) | ((u32)(((u32)(e->em_ltgt) & ((0x01 << (16)) - 1)) << (0))); _a->w1 = ((u32)(((u32)(e->em_lratm) & ((0x01 << (16)) - 1)) << (16))) | ((u32)(((u32)(e->em_lratl) & ((0x01 << (16)) - 1)) << (0))); };
        { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(9) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(6) & ((0x01 << (8)) - 1)) << (16))) | ((u32)(((u32)(e->em_cvolL) & ((0x01 << (16)) - 1)) << (0))); _a->w1 = ((u32)(((u32)(e->em_dryamt) & ((0x01 << (16)) - 1)) << (16))) | ((u32)(((u32)(e->em_wetamt) & ((0x01 << (16)) - 1)) << (0))); };
        { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(9) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(4) & ((0x01 << (8)) - 1)) << (16))) | ((u32)(((u32)(e->em_rtgt) & ((0x01 << (16)) - 1)) << (0))); _a->w1 = ((u32)(((u32)(e->em_rratm) & ((0x01 << (16)) - 1)) << (16))) | ((u32)(((u32)(e->em_rratl) & ((0x01 << (16)) - 1)) << (0))); };
        { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(3) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(1) & ((0x01 << (8)) - 1)) << (16))) | ((u32)(((u32)(e->em_cvolR) & ((0x01 << (16)) - 1)) << (0))); _a->w1 = (u32)(osVirtualToPhysical(e->em_state)); };
    } else {
        { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(3) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(0) & ((0x01 << (8)) - 1)) << (16))) | ((u32)(((u32)(0) & ((0x01 << (16)) - 1)) << (0))); _a->w1 = (u32)(osVirtualToPhysical(e->em_state)); };
    }
    *inp += 184 << 1;
    e->em_delta += 184;
    return ptr;
}
s16 func_00016efc(f64 vol, f64 tgt, s32 count, u16 *ratel);
