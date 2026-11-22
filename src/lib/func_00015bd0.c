#include "common/mus_config.h"
#include "common/mus_synth.h"
#include "common/os_thread.h"

#include "common/audio_heap.h"

typedef struct {
    u32 w0;
    u32 w1;
} Acmd;

typedef struct {
    s16 *ptr;
    u32 len;
} AudioBuffer;
extern Thread D_800B18B0;
extern u8 *D_800B1A60;
extern AudioBuffer *D_800B1A64;
extern Acmd *D_800B1A68;
extern AlGlobalsLike D_800E7D18;
L4Heap *func_00015f24(void);
u32 func_00015fd0(u32 retrace, u32 output_rate, u32 vsyncs_per_second, u32 extra_ratio);
void *func_00015edc(s32 size);
s32 func_0001c830(u32 frequency);
void func_00015d08(void *arg);
void func_00015bd0(MusConfig *config, s32 vsyncs_per_second, s32 fx_type) {
    ALSynConfig audio_config;
    u32 i;
    s32 frame_size;
    audio_config.maxVVoices = audio_config.maxPVoices = config->channels;
    audio_config.maxUpdates = config->syn_updates;
    audio_config.dmaproc = func_000155c0(config->syn_num_dma_bufs, config->syn_dma_buf_size);
    audio_config.fxType = fx_type;
    audio_config.outputRate = func_0001c830(config->syn_output_rate);
    audio_config.heap = func_00015f24();
    func_00014d70(&D_800E7D18, &audio_config);
    frame_size = func_00015fd0(config->syn_retraceCount, audio_config.outputRate, vsyncs_per_second, 20);
    D_800B1A68 = func_00015edc(config->syn_rsp_cmds * sizeof(Acmd));
    D_800B1A64 = func_00015edc(3 * sizeof(AudioBuffer));
    for (i = 0; i < 3; i++) {
        D_800B1A64[i].ptr = func_00015edc(frame_size * 4);
    }
    D_800B1A60 = func_00015edc(0x2000);
    osCreateThread(&D_800B18B0, 3, func_00015d08, ((void *)0), D_800B1A60 + 0x2000, config->thread_priority);
    osStartThread(&D_800B18B0);
}
void func_00015d08(void *arg);
