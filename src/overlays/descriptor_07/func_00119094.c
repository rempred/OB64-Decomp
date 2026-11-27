struct RuntimeUnit;
#include "common/types.h"
#include "game/sound_channel_services.h"
extern SoundChannel D_800EB1F0;
void D_801B2D2C(void *unit);
void func_00118D0C(struct RuntimeUnit *);
void func_0012A958(struct RuntimeUnit *);
void func_00118D0C(struct RuntimeUnit *);
void func_00119094(struct RuntimeUnit *a, struct RuntimeUnit *b) {
    D_801B2D2C(a);
    *(u32 *)a &= ~0x10;
    func_00118D0C(a);
    func_0012A958(a);
    D_801B2D2C(b);
    *(u32 *)b &= ~0x10;
    D_800EA604(&D_800EB1F0, 0x289);
    func_00118D0C(b);
    func_0012A958(b);
}
