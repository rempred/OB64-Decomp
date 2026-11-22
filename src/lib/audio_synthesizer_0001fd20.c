/* Whole producer ROM 1FD20..20360, independently reconstructed from ROM.
 * Original-owned global pointer and protected companions retain their roles. */
#include "common/audio_filter.h"

extern L4Synth *alGlobals;
extern void *alHeapDBAlloc(void *, int, void *, int, int);
extern void alSaveNew(L4Save *);
extern void alAuxBusNew(L4Bus *, L4Filter **, int);
extern void alMainBusNew(L4Bus *, L4Filter **, int);
extern void *alSynAllocFX(L4Synth *, short, void *, void *);
extern int alMainBusParam(L4Bus *, int, L4Filter *);
extern void alLoadNew(L4Load *, L4DmaConstructor, void *);
extern void alLoadParam(void *, int, void *);
extern void alResampleNew(L4Resample *, void *);
extern int alResampleParam(L4Filter *, int, void *);
extern void alEnvmixerNew(L4Envelope *, void *);
extern int alEnvmixerParam(void *, int, void *);
extern int alAuxBusParam(L4Bus *, int, L4Filter *);
extern int alSaveParam(L4Save *, int, void *);
int func_00020308(L4Synth *, L4Client **);
int func_00020274(L4Synth *, int);
void func_000201e0(L4Synth *);

void func_0001fd20(L4Synth *s, L4Config *config)
{
    void *heap = config->heap;
    L4Save *save;
    L4Voice *voices;
    L4Param *params;
    int i;

    s->clients = 0;
    s->maxVoices = config->maxVoices;
    s->currentSample = 0;
    s->nextSample = 0;
    s->outputRate = config->outputRate;
    s->maxBlock = 160;
    s->dmaConstructor = config->dmaConstructor;
    save = alHeapDBAlloc(0, 0, heap, 1, 28);
    alSaveNew(save);
    s->save = save;
    s->slots = alHeapDBAlloc(0, 0, heap, 1, 76);
    s->field40 = 1;
    alAuxBusNew(&s->slots->bus, alHeapDBAlloc(0, 0, heap, config->maxVoices, 4), config->maxVoices);
    s->mainBus = alHeapDBAlloc(0, 0, heap, 1, 32);
    alMainBusNew(s->mainBus, alHeapDBAlloc(0, 0, heap, config->maxVoices, 4), config->maxVoices);
    if (config->fxType)
        alSynAllocFX(s, 0, config, heap);
    else
        alMainBusParam(s->mainBus, 2, &s->slots->bus.filter);
    s->freeVoices.next = 0;
    s->freeVoices.prev = 0;
    s->lameVoices.next = 0;
    s->lameVoices.prev = 0;
    s->allocatedVoices.next = 0;
    s->allocatedVoices.prev = 0;
    voices = alHeapDBAlloc(0, 0, heap, config->maxVoices, sizeof(L4Voice));
    for (i = 0; i < config->maxVoices; i++) {
        L4Voice *voice = &voices[i];
        L4Load *load = &voice->load;
        L4Resample *resample = &voice->resample;
        L4Envelope *env = &voice->env;
        alLink(&voice->link, &s->freeVoices);
        voice->field08 = 0;
        alLoadNew(load, (L4DmaConstructor)s->dmaConstructor, heap);
        alLoadParam(load, 1, 0);
        alResampleNew(resample, heap);
        alResampleParam(&resample->filter, 1, &load->filter);
        alEnvmixerNew(env, heap);
        alEnvmixerParam(env, 1, &resample->filter);
        alAuxBusParam(&s->slots->bus, 2, &env->filter);
        voice->filter = &env->filter;
    }
    alSaveParam(save, 1, &s->mainBus->filter);
    params = alHeapDBAlloc(0, 0, heap, config->maxParams, sizeof(L4Param));
    s->freeParams = 0;
    for (i = 0; i < config->maxParams; i++) {
        params[i].next = s->freeParams;
        s->freeParams = &params[i];
    }
    s->heap = heap;
}

L4Command *func_0001ffec(L4Command *inputCommands, int *length, short *outputBuffer, int samples)
{
    L4Synth *s = alGlobals;
    L4Command *commands = inputCommands;
    short *output = outputBuffer;
    L4Client *client;
    short dmemOutput = 0;
    if (!s->clients) {
        *length = 0;
        return commands;
    }
    s->nextSample = func_00020308(s, &client);
    while (s->nextSample - s->currentSample < samples) {
        int usecs;
        s->nextSample &= ~15;
        usecs = client->handler(client);
        client->sampleTime += func_00020274(s, usecs);
        s->nextSample = func_00020308(s, &client);
    }
    s->nextSample &= ~15;
    while (samples > 0) {
        int count = s->maxBlock;
        L4Save *save;
        if (samples < count)
            count = samples;
        {
            /* Keep the current packet until pull consumes commands + 1. */
            commands->word0 = 0x07000000;
            commands->word1 = 0;
        }
        save = s->save;
        ((L4SaveParam)save->filter.param)(save, 6, output);
        samples -= count;
        commands = save->filter.pull(save, &dmemOutput, count, s->currentSample, commands + 1);
        output += count * 2;
        s->currentSample += count;
    }
    *length = commands - inputCommands;
    func_000201e0(s);
    return commands;
}

L4Param *func_0002019c(void)
{
    L4Synth *s = alGlobals;
    L4Param *param = 0;
    if (s->freeParams) {
        param = s->freeParams;
        s->freeParams = param->next;
        param->next = 0;
    }
    return param;
}

void func_000201c8(L4Param *param)
{
    L4Synth *s = alGlobals;
    param->next = s->freeParams;
    s->freeParams = param;
}

void func_000201e0(L4Synth *s)
{
    L4Link *voice;
    while ((voice = s->lameVoices.next) != 0) {
        alUnlink(voice);
        alLink(voice, &s->freeVoices);
    }
}

void func_00020234(L4Synth *s, L4Voice *voice)
{
    alUnlink(&voice->link);
    alLink(&voice->link, &s->lameVoices);
}

int func_00020274(L4Synth *s, int usecs)
{
    return (int)(float)(((double)((float)usecs * (float)s->outputRate) / 1000000.0) + 0.5);
}

int func_000202bc(L4Synth *s, int usecs)
{
    return (int)(float)(((double)((float)usecs * (float)s->outputRate) / 1000000.0) + 0.5) & ~15;
}

int func_00020308(L4Synth *s, L4Client **client)
{
    L4Client *p;
    int minimum = 0x7fffffff;
    *client = 0;
    for (p = s->clients; p; p = p->next) {
        if (p->sampleTime - s->currentSample < minimum) {
            *client = p;
            minimum = p->sampleTime - s->currentSample;
        }
    }
    return (*client)->sampleTime;
}
