#include "common/mus_voice.h"

void *alHeapDBAlloc(void *file, s32 line, void *hp, s32 num, s32 size);
void func_0001658c(N_PVoice *mv, ALDMANew dmaNew, void *hp) {
    mv->dc_state = alHeapDBAlloc(0, 0, (hp), (1), (0x20));
    mv->dc_lstate = alHeapDBAlloc(0, 0, (hp), (1), (0x20));
    mv->dc_dma = dmaNew(&mv->dc_dmaState);
    mv->dc_lastsam = 0;
    mv->dc_first = 1;
    mv->dc_memin = 0;
    mv->rs_state = alHeapDBAlloc(0, 0, (hp), (1), (0x20));
    mv->rs_delta = 0.0;
    mv->rs_first = 1;
    mv->rs_ratio = 1.0;
    mv->rs_upitch = 0;
    mv->em_state = alHeapDBAlloc(0, 0, (hp), (1), (0x50));
    mv->em_first = 1;
    mv->em_motion = 0;
    mv->em_volume = 1;
    mv->em_ltgt = 1;
    mv->em_rtgt = 1;
    mv->em_cvolL = 1;
    mv->em_cvolR = 1;
    mv->em_dryamt = 0;
    mv->em_wetamt = 0;
    mv->em_lratm = 1;
    mv->em_lratl = 0;
    mv->em_lratm = 1;
    mv->em_lratl = 0;
    mv->em_delta = 0;
    mv->em_segEnd = 0;
    mv->em_pan = 0;
    mv->em_ctrlList = 0;
    mv->em_ctrlTail = 0;
}
