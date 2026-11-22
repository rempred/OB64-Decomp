#include "common/pi_handle.h"
extern OSPiHandle *D_800E79AC;
extern OSPiHandle D_800BE110;
void bzero(void *p, s32 n);
void func_0001a440(void) {
    if (D_800BE110.baseAddress == 0xA8000000) {
        return;
    }
    D_800BE110.type = 3;
    D_800BE110.baseAddress = 0xA8000000;
    D_800BE110.latency = 5;
    D_800BE110.pulse = 0xC;
    D_800BE110.pageSize = 0xD;
    D_800BE110.relDuration = 2;
    D_800BE110.domain = 1;
    D_800BE110.speed = 0;
    bzero(&D_800BE110.transferInfo, sizeof(D_800BE110.transferInfo));
    func_0001c0e0(&D_800BE110);
    D_800E79AC = &D_800BE110;
}
