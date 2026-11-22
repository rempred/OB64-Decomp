/* Complete two-body producer, independently derived from ROM 1DD30..1DE40. */
#include "common/audio_filter.h"

L4Command *func_0001dd30(void *filter, short *output, int count, int offset,
                         L4Command *commands)
{
    L4Bus *bus = (L4Bus *)filter;
    L4Filter **source = bus->sources;
    int i;

    {
        L4Command *command = commands++;
        command->word0 = 0x020006C0;
        command->word1 = count << 1;
    }
    {
        L4Command *command = commands++;
        command->word0 = 0x02000800;
        command->word1 = count << 1;
    }
    for (i = 0; i < bus->count; i++) {
        commands = source[i]->pull(source[i], output, count, offset, commands);
    }
    return commands;
}

int func_0001de0c(L4Bus *bus, int selector, L4Filter *source)
{
    L4Filter **sources = bus->sources;
    if (selector == 2)
        sources[bus->count++] = source;
    return 0;
}
