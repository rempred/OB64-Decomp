#include "common/mus_voice.h"
#include "common/mus_channel.h"

void func_00012ee8(MusChannel *cp, s32 voice);

void func_00012ee8(MusChannel *cp, s32 voice) {
    if (cp->unkC9 != 0) {
        func_00018950(&D_800B1808[voice]);
    }
    cp->unkC9 = 1;
    func_000188c0(&D_800B1808[voice], cp->pdata);
    cp->pdata = ((void *)0);
}
