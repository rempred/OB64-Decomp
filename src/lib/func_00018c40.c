#include "common/mus_effect.h"
#include "common/mus_voice.h"
typedef signed long long s64;

typedef struct {
    u32 w0;
    u32 w1;
} Acmd;

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
    ALLink pFreeList;
    ALLink pAllocList;
    ALLink pLameList;
    s32 paramSamples;
    s32 curSamples;
    void *dma;
    void *heap;
    ALParam *paramList;
    struct {
        u8 pad00[4];
        void *handler;
    } *mainBus;
    struct {
        u8 pad00[0x14];
        s32 sourceCount;
        s32 maxSources;
        N_PVoice **sources;
        void *fx;
    } *auxBus;
    s32 numPVoices;
    u8 pad3C[4];
    s32 outputRate;
    s32 maxOutSamples;
    s32 sv_dramout;
    s32 sv_first;
} N_ALSynthFull;
Acmd *func_00018f30(s32 sampleOffset, Acmd *p);
void func_00018dec(void);
s32 func_00018e84(s32 micros);
Acmd *func_00018c40(Acmd *cmdList, s32 *cmdLen, s16 *outBuf, s32 outLen) {
    ALPlayer *client;
    Acmd *cmdlEnd = cmdList;
    Acmd *cmdPtr;
    s32 nOut;
    s16 *lOutBuf = outBuf;
    if (((N_ALSynthFull *)D_800A9E54)->head == ((void *)0)) {
        *cmdLen = 0;
        return cmdList;
    }
    client = ((N_ALSynthFull *)D_800A9E54)->head;
    while (client->samplesLeft - ((N_ALSynthFull *)D_800A9E54)->curSamples < outLen) {
        ((N_ALSynthFull *)D_800A9E54)->paramSamples = client->samplesLeft & ~0xF;
        client->samplesLeft += func_00018e84((*client->handler)(client));
    }
    ((N_ALSynthFull *)D_800A9E54)->paramSamples &= ~0xF;
    while (outLen > 0) {
        nOut = (((((N_ALSynthFull *)D_800A9E54)->maxOutSamples) < (outLen)) ? (((N_ALSynthFull *)D_800A9E54)->maxOutSamples) : (outLen));
        cmdPtr = cmdlEnd;
        ((N_ALSynthFull *)D_800A9E54)->sv_dramout = (s32)lOutBuf;
        cmdlEnd = func_00018f30(((N_ALSynthFull *)D_800A9E54)->curSamples, cmdPtr);
        outLen -= nOut;
        lOutBuf += nOut << 1;
        ((N_ALSynthFull *)D_800A9E54)->curSamples += nOut;
    }
    *cmdLen = (s32)(cmdlEnd - cmdList);
    func_00018dec();
    return cmdlEnd;
}
void func_00018dec(void);
s32 func_00018e84(s32 micros);
