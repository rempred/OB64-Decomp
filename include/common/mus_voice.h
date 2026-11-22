#ifndef OB64_COMMON_MUS_VOICE_H
#define OB64_COMMON_MUS_VOICE_H

#include "common/mus_types.h"
#include "common/audio_link.h"
#include "common/mus_dma.h"

typedef struct {
    u32 start;
    u32 end;
    u32 count;
    s16 state[16];
} ALADPCMloop;

typedef struct {
    s32 order;
    s32 npredictors;
    s16 book[1];
} ALADPCMBook;

typedef struct {
    u32 start;
    u32 end;
    u32 count;
} ALRawLoop;

typedef struct {
    u8 *base;
    s32 len;
    u8 type;
    u8 flags;
    union ALWaveInfo {
        struct ALADPCMWaveInfo {
            ALADPCMloop *loop;
            ALADPCMBook *book;
        } adpcmWave;
        struct ALRawWaveInfo {
            ALRawLoop *loop;
        } rawWave;
    } waveInfo;
} ALWaveTable;

typedef struct {
    ALLink node;
    void *vvoice;
    s16 *dc_state;
    s16 *dc_lstate;
    ALRawLoop dc_loop;
    ALWaveTable *dc_table;
    s32 dc_bookSize;
    ALDMAproc dc_dma;
    void *dc_dmaState;
    s32 dc_sample;
    s32 dc_lastsam;
    s32 dc_first;
    s32 dc_memin;
    s16 *rs_state;
    f32 rs_ratio;
    s32 rs_upitch;
    f32 rs_delta;
    s32 rs_first;
    s16 *em_state;
    s16 em_pan;
    s16 em_volume;
    s16 em_cvolL;
    s16 em_cvolR;
    s16 em_dryamt;
    s16 em_wetamt;
    u16 em_lratl;
    s16 em_lratm;
    s16 em_ltgt;
    u16 em_rratl;
    s16 em_rratm;
    s16 em_rtgt;
    s32 em_delta;
    s32 em_segEnd;
    s32 em_first;
    struct ALParam_s *em_ctrlList;
    struct ALParam_s *em_ctrlTail;
    s32 em_motion;
    s32 offset;
} N_PVoice;

typedef struct ALParam_s {
    struct ALParam_s *next;
    s32 delta;
    s16 type;
    s16 unity;
    union ALParamData {
        f32 f;
        s32 i;
    } data;
    union ALParamMoreData {
        f32 f;
        s32 i;
    } moredata;
    union ALParamStillMoreData {
        f32 f;
        s32 i;
    } stillmoredata;
    union ALParamYetMoreData {
        f32 f;
        s32 i;
    } yetstillmoredata;
} ALParam;

typedef struct N_ALVoice {
    ALLink node;
    N_PVoice *pvoice;
    ALWaveTable *table;
    void *clientPrivate;
    s16 state;
    s16 priority;
    s16 fxBus;
    s16 unityPitch;
} N_ALVoice;

extern N_ALVoice *D_800B1808;

void func_0001658c(N_PVoice *voice, ALDMANew factory, void *heap);
void func_000186e0(N_ALVoice *voice, u8 pan);
void func_00018810(N_ALVoice *voice, s16 volume, s32 time);
void func_000188c0(N_ALVoice *voice, ALWaveTable *wave);
void func_00018950(N_ALVoice *voice);

#endif
