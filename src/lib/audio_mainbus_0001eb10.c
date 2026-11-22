/* Complete two-body producer, independently derived from ROM 1EB10..1EC80. */
#include "common/audio_filter.h"

L4Command *func_0001eb10(void *filter, short *output, int count, int offset,
                         L4Command *commands)
{
    L4Bus *bus = (L4Bus *)filter;
    L4Filter **source = bus->sources;
    int i;

    {
        L4Command *command = commands++;
        command->word0 = 0x02000440;
        command->word1 = count << 1;
    }
    {
        L4Command *command = commands++;
        command->word0 = 0x02000580;
        command->word1 = count << 1;
    }
    for (i = 0; i < bus->count; i++) {
        commands = source[i]->pull(source[i], output, count, offset, commands);
        {
            L4Command *command = commands++;
            command->word0 = 0x08000000;
            command->word1 = (count << 1) & 0xFFFF;
        }
        {
            L4Command *command = commands++;
            command->word0 = 0x0C007FFF;
            command->word1 = 0x06C00440;
        }
        {
            L4Command *command = commands++;
            command->word0 = 0x0C007FFF;
            command->word1 = 0x08000580;
        }
    }
    return commands;
}

int func_0001ec50(L4Bus *bus, int selector, L4Filter *source)
{
    L4Filter **sources = bus->sources;
    if (selector == 2)
        sources[bus->count++] = source;
    return 0;
}

