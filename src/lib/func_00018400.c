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

typedef struct ALPlayer_s {
    struct ALPlayer_s *next;
    void *clientData;
    s32 (*handler)(void *);
    s32 callTime;
    s32 samplesLeft;
} ALPlayer;
typedef struct {
    ALPlayer *head;
    u8 pad04[0x1C];
    s32 curSamples;
} N_ALSynthPlayers;
u32 osSetIntMask(u32 mask);
void func_00018400(ALPlayer *client) {
    N_ALSynthPlayers *syn;
    u32 mask = osSetIntMask(1);
    syn = (N_ALSynthPlayers *)D_800A9E54;
    client->samplesLeft = syn->curSamples;
    client->next = syn->head;
    syn->head = client;
    osSetIntMask(mask);
}
