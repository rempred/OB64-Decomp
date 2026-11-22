#include "common/mus_voice.h"

void mem_byte_copy(const void *src, void *dest, s32 len);
void func_000174d8(void *filter, s32 paramID, void *param) {
    N_PVoice *a = (N_PVoice *)filter;
    switch (paramID) {
        case 5:
            a->dc_table = (ALWaveTable *)param;
            a->dc_memin = (s32)a->dc_table->base;
            a->dc_sample = 0;
            switch (a->dc_table->type) {
                case 0:
                    a->dc_table->len = 9 * ((s32)(a->dc_table->len / 9));
                    a->dc_bookSize = 2 * a->dc_table->waveInfo.adpcmWave.book->order *
                                     a->dc_table->waveInfo.adpcmWave.book->npredictors * 8;
                    if (a->dc_table->waveInfo.adpcmWave.loop) {
                        a->dc_loop.start = a->dc_table->waveInfo.adpcmWave.loop->start;
                        a->dc_loop.end = a->dc_table->waveInfo.adpcmWave.loop->end;
                        a->dc_loop.count = a->dc_table->waveInfo.adpcmWave.loop->count;
                        mem_byte_copy(a->dc_table->waveInfo.adpcmWave.loop->state, a->dc_lstate, 0x20);
                    } else {
                        a->dc_loop.start = a->dc_loop.end = a->dc_loop.count = 0;
                    }
                    break;
                case 1:
                    if (a->dc_table->waveInfo.rawWave.loop) {
                        a->dc_loop.start = a->dc_table->waveInfo.rawWave.loop->start;
                        a->dc_loop.end = a->dc_table->waveInfo.rawWave.loop->end;
                        a->dc_loop.count = a->dc_table->waveInfo.rawWave.loop->count;
                    } else {
                        a->dc_loop.start = a->dc_loop.end = a->dc_loop.count = 0;
                    }
                    break;
                default:
                    break;
            }
            break;
        case 4:
            a->dc_lastsam = 0;
            a->dc_first = 1;
            a->dc_sample = 0;
            if (a->dc_table) {
                a->dc_memin = (s32)a->dc_table->base;
                if (a->dc_table->type == 0) {
                    if (a->dc_table->waveInfo.adpcmWave.loop) {
                        a->dc_loop.count = a->dc_table->waveInfo.adpcmWave.loop->count;
                    }
                } else if (a->dc_table->type == 1) {
                    if (a->dc_table->waveInfo.rawWave.loop) {
                        a->dc_loop.count = a->dc_table->waveInfo.rawWave.loop->count;
                    }
                }
            }
            break;
        default:
            break;
    }
}
