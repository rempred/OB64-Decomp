#include "common/mus_config.h"
#include "common/mus_channel.h"
#include "common/mus_voice.h"

void *func_00015edc(s32 size);
extern s32 D_800B1818;
extern void *D_800B1828;
extern MusBank *D_800B182C;
extern s32 D_800B1834;
extern MusFxBank *D_800B1838;
extern MusFxBank *D_800B183C;
extern s32 D_800B1840;
extern s32 D_800B1804;
extern MusChannel *D_800B180C;
extern MusChannel *D_800B1810;
extern s32 D_800B1814;
void func_000118c4(s32 flags, s16 volume);
void func_000121b4(MusBank *bank, u8 *wbank);
void func_00012530(s32 n);
s32 func_000126ac(void *player);

typedef struct {
    s16 priority;
    s16 fxBus;
    u8 unityPitch;
} ALVoiceConfig;

typedef struct ALPlayer_s {
    struct ALPlayer_s *next;
    void *clientData;
    s32 (*handler)(void *);
    s32 callTime;
    s32 samplesLeft;
} ALPlayer;
extern s32 osTvType;
extern s32 D_800C4B48;
extern u32 D_800E7A14;
extern ALPlayer D_800B17F0;
void func_00015e90(u8 *heap, s32 length);
void func_00015a20(void *sched);
void func_00018400(ALPlayer *player);
s32 func_00018450(N_ALVoice *voice, ALVoiceConfig *vc);
s32 func_00015f0c(void);
void func_00013b38(MusChannel *cp);
extern s32 D_800B1820;
extern s32 D_800B1824;

void func_0001163c(MusConfig *config) {
    s32 i;
    ALVoiceConfig vc;
    D_800C4B48 = config->diskrom_handle;
    D_800E7A14 = config->control_flag;
    D_800B1804 = config->channels + 4;
    if (osTvType == 0) {
        D_800B1814 = 50;
    } else {
        D_800B1814 = 60;
    }
    D_800B1818 = 1000000 / D_800B1814;
    func_00015e90(config->heap, config->heap_length);
    func_00015a20(config->sched);
    D_800B1808 = func_00015edc((D_800B1804 - 4) * sizeof(*D_800B1808));
    D_800B180C = func_00015edc(D_800B1804 * sizeof(MusChannel));
    D_800B1810 = D_800B180C + 4;
    func_00012530(config->fifo_length);
    D_800B1828 = ((void *)0);
    D_800B182C = ((void *)0);
    if (config->ptr != ((void *)0) && config->wbk != ((void *)0)) {
        func_000121b4(config->ptr, config->wbk);
    }
    D_800B183C = ((void *)0);
    D_800B1838 = ((void *)0);
    if (config->default_fxbank != ((void *)0)) {
        func_0001237c(config->default_fxbank);
    }
    D_800B1840 = 0;
    D_800B1834 = 2;
    func_00015bd0(config, D_800B1814, 2);
    func_000118c4(3, 0x7FFF);
    D_800B1820 = 1;
    D_800B1824 = 0x12345678;
    D_800B17F0.next = ((void *)0);
    D_800B17F0.handler = func_000126ac;
    D_800B17F0.clientData = &D_800B17F0;
    func_00018400(&D_800B17F0);
    for (i = 0; i < D_800B1804; i++) {
        D_800B180C[i].unkC9 = 0;
        func_00013b38(&D_800B180C[i]);
        vc.unityPitch = 0;
        vc.priority = config->thread_priority;
        vc.fxBus = 0;
        if (i >= 4) {
            func_00018450(&D_800B1808[i - 4], &vc);
        }
    }
    func_00015f0c();
}
void func_000118c4(s32 flags, s16 volume);
void func_000121b4(MusBank *bank, u8 *wbank);
void func_00012530(s32 n);
s32 func_000126ac(void *player);
