#include "common/mus_voice.h"

s32 func_00016c38(void *filter, s32 paramID, void *param);
void func_000174d8(void *filter, s32 paramID, void *param);
s32 func_00016c38(void *filter, s32 paramID, void *param) {
    N_PVoice *pv = filter;
    switch (paramID) {
        case 3:
            if (pv->em_ctrlTail) {
                pv->em_ctrlTail->next = (ALParam *)param;
            } else {
                pv->em_ctrlList = (ALParam *)param;
            }
            pv->em_ctrlTail = (ALParam *)param;
            break;
        case 4:
            pv->em_first = 1;
            pv->em_motion = 0;
            pv->em_volume = 1;
            pv->em_segEnd = 0;
            pv->rs_delta = 0.0;
            pv->rs_first = 1;
            pv->rs_upitch = 0;
            func_000174d8(pv, 4, param);
            break;
        case 9:
            pv->em_motion = 1;
            break;
        default:
            func_000174d8(pv, paramID, param);
            break;
    }
    return 0;
}
