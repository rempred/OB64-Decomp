#include "common/mus_effect.h"
#include "common/mus_voice.h"
typedef signed long long s64;

typedef struct {
    u8 pad00[0x34];
    struct {
        u8 pad00[0x14];
        s32 sourceCount;
        s32 maxSources;
        N_PVoice **sources;
        ALFx *fx;
        ALFx *fxArr[1];
    } *auxBus;
    s32 numPVoices;
    u8 pad3C[4];
    s32 outputRate;
} N_ALSynth;
extern N_ALSynth *D_800A9E54;

ALParam *func_00018da8(void);
s32 func_00016c38(void *filter, s32 paramID, void *param);
void func_000188c0(N_ALVoice *v, ALWaveTable *table) {
    ALParam *update;
    if (v->pvoice) {
        update = func_00018da8();
        if (update) {
            update->delta = *(s32 *)((u8 *)D_800A9E54 + 0x1C) + v->pvoice->offset;
            update->type = 14;
            update->data.i = (s32)table;
            update->next = 0;
            update->unity = v->unityPitch;
            func_00016c38(v->pvoice, 3, update);
        }
    }
}
