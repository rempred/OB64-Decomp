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
typedef struct {
    s16 priority;
    s16 fxBus;
    u8 unityPitch;
} ALVoiceConfig;
typedef struct {
    void *head;
    ALLink pFreeList;
    ALLink pAllocList;
    ALLink pLameList;
    s32 paramSamples;
} N_ALSynthLists;
s32 func_00018568(N_PVoice **pvoice, s16 priority);
s32 func_00018450(N_ALVoice *voice, ALVoiceConfig *vc) {
    N_PVoice *pvoice = 0;
    ALParam *update;
    s32 stolen;
    voice->priority = vc->priority;
    voice->unityPitch = vc->unityPitch;
    voice->table = 0;
    voice->fxBus = vc->fxBus;
    voice->state = 0;
    voice->pvoice = 0;
    stolen = func_00018568(&pvoice, vc->priority);
    if (pvoice) {
        if (stolen) {
            pvoice->offset = 552;
            ((N_ALVoice *)pvoice->vvoice)->pvoice = 0;
            pvoice->vvoice = voice;
            voice->pvoice = pvoice;
            update = func_00018da8();
            update->delta = ((N_ALSynthLists *)D_800A9E54)->paramSamples;
            update->type = 11;
            update->data.i = 0;
            update->moredata.i = 552 - 184;
            func_00016c38(voice->pvoice, 3, update);
            update = func_00018da8();
            if (update) {
                update->delta = ((N_ALSynthLists *)D_800A9E54)->paramSamples + pvoice->offset;
                update->type = 15;
                update->next = 0;
                func_00016c38(voice->pvoice, 3, update);
            }
        } else {
            pvoice->offset = 0;
            pvoice->vvoice = voice;
            voice->pvoice = pvoice;
        }
    }
    return (pvoice != 0);
}
s32 func_00018568(N_PVoice **pvoice, s16 priority);
