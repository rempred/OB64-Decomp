#include "common/mus_voice.h"

typedef struct {
    u32 w0;
    u32 w1;
} Acmd;

Acmd *func_00017664(Acmd *ptr, N_PVoice *f, s32 tsam, s32 nbytes, s16 outp, s16 inp, u32 flags);
Acmd *func_00017664(Acmd *ptr, N_PVoice *f, s32 tsam, s32 nbytes, s16 outp, s16 inp, u32 flags) {
    s32 dramAlign, dramLoc;
    if (nbytes > 0) {
        dramLoc = (f->dc_dma)(f->dc_memin, nbytes, f->dc_dmaState);
        dramAlign = dramLoc & 0x7;
        nbytes += dramAlign;
        { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(4) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(nbytes + 8 - (nbytes & 0x7)) & ((0x01 << (12)) - 1)) << (12))) | ((u32)(((u32)(inp) & ((0x01 << (12)) - 1)) << (0))); _a->w1 = (u32)(dramLoc - dramAlign); };
    } else {
        dramAlign = 0;
    }
    if (flags & 2) {
        { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(15) & ((0x01 << (8)) - 1)) << (24))); _a->w1 = (u32)(((u32)(f->dc_lstate) & 0x1FFFFFFF)); };
    }
    { Acmd *_a = (Acmd *)ptr++; _a->w0 = ((u32)(((u32)(1) & ((0x01 << (8)) - 1)) << (24))) | ((u32)(((u32)(f->dc_state) & ((0x01 << (24)) - 1)) << (0))); _a->w1 = ((u32)(((u32)(flags) & ((0x01 << (4)) - 1)) << (28))) | ((u32)(((u32)(tsam << 1) & ((0x01 << (12)) - 1)) << (16))) | ((u32)(((u32)(dramAlign) & ((0x01 << (4)) - 1)) << (12))) | ((u32)(((u32)(outp) & ((0x01 << (12)) - 1)) << (0))); };
    f->dc_first = 0;
    return ptr;
}
