#include "common/mus_voice.h"
#include "common/mus_channel.h"

typedef struct {
    u8 type;
    s32 value;
} MusCommand;
extern MusCommand *D_800B1850;
extern s32 D_800B184C;
extern s32 D_800B1848;
extern s32 D_800B1844;
extern s32 D_800B1818;
extern s32 D_800B1804;
extern MusChannel *D_800B180C;
s32 func_000126ac(void *player);
void func_00012ee8(MusChannel *cp, s32 voice);
void func_00012f64(MusChannel *cp, s32 voice);
void func_000130b8(MusChannel *cp, s32 voice, f32 offset);
void func_00013234(MusChannel *cp);
void func_0001342c(MusChannel *cp);
f32 func_000134e4(MusChannel *cp);
f32 func_0001353c(MusChannel *cp);
void func_0001299c(MusChannel *cp, s32 voice);
void func_00013664(MusChannel *cp);

void func_00012594(MusCommand *cmd);
s32 func_000126ac(void *player) {
    s32 i;
    MusChannel *cp;
    f32 pitch;
    while (D_800B1844 != D_800B1848) {
        func_00012594(&D_800B1850[D_800B1844]);
        D_800B1844++;
        if (D_800B1844 == D_800B184C) {
            D_800B1844 = 0;
        }
    }
    for (i = -4, cp = D_800B180C; i < D_800B1804 - 4; i++, cp++) {
        if (cp->unk04 == 0) {
            continue;
        }
        if (cp->unk00 & 1) {
            continue;
        }
        if (cp->pdata != ((void *)0)) {
            func_00012ee8(cp, i);
        }
        cp->unk0C += cp->unk9C;
        if (cp->unk9A != 0x7FFF) {
            while (cp->unk3C - cp->unk0C < 0) {
                if (cp->unk04 == 0) {
                    goto next;
                }
                func_0001299c(cp, i);
            }
            if (cp->unk04 == 0) {
                continue;
            }
        }
        if (cp->pvolume != ((void *)0) && cp->unk14 - cp->unk0C < 0) {
            func_000135a0(cp);
        }
        if (cp->ppitchbend != ((void *)0) && cp->unk18 - cp->unk0C < 0) {
            func_00013664(cp);
        }
        if (cp->unk10 != -1 && --cp->unk10 == -1) {
            cp->pvolume = ((void *)0);
            cp->ppitchbend = ((void *)0);
            cp->unk74 = ((void *)0);
            cp->unk78 = ((void *)0);
            cp->handle = 0;
            cp->pdata = ((void *)0);
            cp->unk04 = 0;
            if (cp->unkC9 != 0) {
                cp->unkC9 = 0;
                func_00018950(&D_800B1808[i]);
            }
        }
        if (cp->unkC9 != 0) {
            if (cp->unkC3 != 0) {
                func_00013234(cp);
            }
            if (cp->unkD4 != 0 && cp->unk94 - cp->unk0C < 0) {
                func_0001342c(cp);
            }
            pitch = cp->unk30;
            if (cp->vib_speed != 0) {
                pitch += func_0001353c(cp);
            }
            if (cp->wobble != 0) {
                pitch += func_000134e4(cp);
            }
            if (cp->pdata == ((void *)0)) {
                func_000130b8(cp, i, pitch);
                func_00012f64(cp, i);
            }
        }
        cp->unkAA = (u32)(cp->unk0C - cp->unk40) >> 8;
    next:;
    }
    return D_800B1818;
}
void func_0001299c(MusChannel *cp, s32 voice);
void func_00012ee8(MusChannel *cp, s32 voice);
void func_00012f64(MusChannel *cp, s32 voice);
void func_000130b8(MusChannel *cp, s32 voice, f32 offset);
void func_00013234(MusChannel *cp);
void func_0001342c(MusChannel *cp);
f32 func_000134e4(MusChannel *cp);
f32 func_0001353c(MusChannel *cp);
void func_00013664(MusChannel *cp);
