/* ROM 20370 proves the 76-byte slot stride and nested +0x20 field. */
#include "common/audio_filter.h"

extern void func_0001ca94(L4Effect *, L4Config *, void *);
extern int func_0001f2a4(L4Filter *, int, void *);
extern int func_0001ec50(L4Bus *, int, L4Filter *);

void *func_00020370(L4Synth *synth, short bus, void *config, void *heap)
{
    func_0001ca94(&synth->slots[bus].effect, config, heap);
    func_0001f2a4(&synth->slots[bus].effect.filter, 1,
                 &synth->slots[bus].bus.filter);
    func_0001ec50(synth->mainBus, 2, &synth->slots[bus].effect.filter);
    return &synth->slots[bus].effect;
}
