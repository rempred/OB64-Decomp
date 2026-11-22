/* Eight complete constructor bodies, independently reconstructed from ROM.
 * Explicit inline preserves the caller's observed embedded LP-filter setup
 * while retaining the callable global helper under the legacy profile. */
#include "common/audio_filter.h"

typedef unsigned short u16;

extern void func_0001eaf0(L4Filter *, L4Pull, L4ParamAddress, int);
extern void *bump_alloc(void *, int, void *, int, int);
extern L4Command *func_0001ef30(void *, short *, int, int, L4Command *);
extern L4Command *func_0001de40(void *, short *, int, int, L4Command *);
extern L4Command *func_0001d220(void *, short *, int, int, L4Command *);
extern L4Command *func_0001ec80(void *, short *, int, int, L4Command *);
extern L4Command *func_0001dd30(void *, short *, int, int, L4Command *);
extern L4Command *func_0001eb10(void *, short *, int, int, L4Command *);
extern L4Command *func_0001fad0(void *, short *, int, int, L4Command *);
extern int func_0001f2a4(L4Filter *, int, void *);
extern int func_0001f2b8(L4Effect *, int, int *);
extern int func_0001e340(void *, int, void *);
extern void func_0001da00(void *, int, void *);
extern int func_0001ee6c(L4Filter *, int, void *);
extern int func_0001de0c(L4Bus *, int, L4Filter *);
extern int func_0001ec50(L4Bus *, int, L4Filter *);
extern int func_0001fb78(L4Save *, int, void *);
extern int data_800AA460[], data_800AA4C8[], data_800AA550[];
extern int data_800AA578[], data_800AA5A0[], data_800AA5C8[];

inline void func_0001c9f0(L4Lowpass *filter)
{
    int cutoff;
    short coefficient;
    int i;
    double value, multiplier;

    filter->first = 1;
    cutoff = (filter->cutoff * 0x4000) >> 15;
    coefficient = cutoff;
    filter->gain = 0x4000 - cutoff;
    for (i = 7; i >= 0; i--)
        filter->coefficients[i] = 0;
    filter->coefficients[8] = coefficient;
    value = coefficient / 16384.0;
    multiplier = value;
    for (i = 9; i < 16; i++) {
        value *= multiplier;
        filter->coefficients[i] = value * 16384.0;
    }
}

void func_0001ca94(L4Effect *effect, L4Config *config, void *heap)
{
    int *params;
    u16 i, j, p;
    L4Delay *delay;

    func_0001eaf0(&effect->filter, 0, (L4ParamAddress)func_0001f2a4, 5);
    effect->filter.pull = func_0001ef30;
    effect->paramHandler = func_0001f2b8;
    switch (config->fxType) {
    case 1: params = data_800AA460; break;
    case 2: params = data_800AA4C8; break;
    case 5: params = data_800AA550; break;
    case 3: params = data_800AA578; break;
    case 4: params = data_800AA5A0; break;
    case 6: params = config->effectParams; break;
    default: params = data_800AA5C8; break;
    }
    effect->count = params[0];
    effect->length = params[1];
    effect->delays = bump_alloc(0, 0, heap, effect->count, sizeof(L4Delay));
    effect->buffer = bump_alloc(0, 0, heap, effect->length, sizeof(short));
    effect->cursor = effect->buffer;
    p = 2;
    for (i = 0; i < effect->length; i++)
        effect->buffer[i] = 0;
    for (j = 0; j < effect->count; j++) {
        delay = &effect->delays[j];
        delay->input = params[p++];
        delay->output = params[p++];
        delay->field0a = params[p++];
        delay->field08 = params[p++];
        delay->field0c = params[p++];
        if (params[p]) {
            delay->rate = 2.0 * ((float)params[p++] / 1000.0f) / config->outputRate;
            delay->depth = ((float)params[p++] / 173123.404906676) *
                           (delay->output - delay->input);
            delay->ratio = 1.0f;
            delay->field18 = 0;
            delay->resample = bump_alloc(0, 0, heap, 1, sizeof(L4Resample));
            delay->resample->state = bump_alloc(0, 0, heap, 1, 32);
            delay->resample->fraction = 0.0f;
            delay->resample->first = 1;
        } else {
            delay->resample = 0;
            p += 2;
        }
        if (params[p]) {
            delay->lowpass = bump_alloc(0, 0, heap, 1, sizeof(L4Lowpass));
            delay->lowpass->state = bump_alloc(0, 0, heap, 1, 8);
            delay->lowpass->cutoff = params[p++];
            func_0001c9f0(delay->lowpass);
        } else {
            delay->lowpass = 0;
            p++;
        }
    }
}

void func_0001cf2c(L4Envelope *envelope, void *heap)
{
    func_0001eaf0(&envelope->filter, func_0001de40, (L4ParamAddress)func_0001e340, 4);
    envelope->state = bump_alloc(0, 0, heap, 1, 80);
    envelope->first = 1;
    envelope->playing = 0;
    envelope->volume = 1;
    envelope->leftTarget = 1;
    envelope->rightTarget = 1;
    envelope->left = 1;
    envelope->right = 1;
    envelope->dry = 0;
    envelope->wet = 0;
    envelope->leftRate = 1;
    envelope->leftFraction = 0;
    envelope->leftRate = 1;
    envelope->leftFraction = 0;
    envelope->elapsed = 0;
    envelope->duration = 0;
    envelope->pan = 0;
    envelope->head = 0;
    envelope->tail = 0;
    envelope->field44 = 0;
}

void func_0001cfe4(L4Load *load, L4DmaConstructor createDma, void *heap)
{
    func_0001eaf0(&load->filter, func_0001d220, (L4ParamAddress)func_0001da00, 0);
    load->state14 = bump_alloc(0, 0, heap, 1, 32);
    load->state18 = bump_alloc(0, 0, heap, 1, 32);
    load->dma = (L4Dma)createDma(&load->dmaState);
    load->previousSamples = 0;
    load->first = 1;
    load->field44 = 0;
}

void func_0001d094(L4Resample *resample, void *heap)
{
    func_0001eaf0(&resample->filter, func_0001ec80, (L4ParamAddress)func_0001ee6c, 1);
    resample->state = bump_alloc(0, 0, heap, 1, 32);
    resample->fraction = 0.0f;
    resample->first = 1;
    resample->field30 = 0;
    resample->field1c = 0;
    resample->field28 = 0;
    resample->field2c = 0;
    resample->ratio.value = 1.0f;
}

void func_0001d120(L4Bus *bus, L4Filter **sources, int capacity)
{
    func_0001eaf0(&bus->filter, func_0001dd30, (L4ParamAddress)func_0001de0c, 6);
    bus->count = 0;
    bus->capacity = capacity;
    bus->sources = sources;
}

void func_0001d17c(L4Bus *bus, L4Filter **sources, int capacity)
{
    func_0001eaf0(&bus->filter, func_0001eb10, (L4ParamAddress)func_0001ec50, 7);
    bus->count = 0;
    bus->capacity = capacity;
    bus->sources = sources;
}

void func_0001d1d8(L4Save *save)
{
    func_0001eaf0(&save->filter, func_0001fad0, (L4ParamAddress)func_0001fb78, 3);
    save->destination = 0;
    save->first = 1;
}






