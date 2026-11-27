struct RuntimeUnit;
#include "common/types.h"
#include "game/sound_channel_services.h"
extern SoundChannel D_800EB1F0;
void D_801B2D2C(void *unit);
void func_00118D0C(struct RuntimeUnit *);
void func_0012A958(struct RuntimeUnit *);
void func_00118D0C(struct RuntimeUnit *);
void func_00118FE8(struct RuntimeUnit *u) {
    D_801B2D2C(u);
    *(u32 *)u &= ~0x10;
    D_800EA604(&D_800EB1F0, 0x289);
    func_00118D0C(u);
    func_0012A958(u);
}
