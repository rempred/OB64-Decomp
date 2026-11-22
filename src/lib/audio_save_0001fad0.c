/* Complete ROM 1FAD0..1FBA0 producer. */
#include "common/audio_filter.h"

L4Command *func_0001fad0(void *filter, short *output, int count, int offset,
                         L4Command *inputCommands)
{
    L4Save *save = (L4Save *)filter;
    L4Filter *input = save->filter.input;
    L4Command *commands = input->pull(input, output, count,
                                       offset, inputCommands);
    {
        L4Command *command = commands++;
        command->word0 = 0x08000000;
        command->word1 = (count << 1) & 0xFFFF;
    }
    {
        L4Command *command = commands++;
        command->word0 = 0x0D000000;
        command->word1 = 0x04400580;
    }
    {
        L4Command *command = commands++;
        command->word0 = 0x08000000;
        command->word1 = (count << 2) & 0xFFFF;
    }
    {
        L4Command *command = commands++;
        command->word0 = 0x06000000;
        command->word1 = (unsigned int)save->destination;
    }
    return commands;
}

int func_0001fb78(L4Save *save, int selector, void *value)
{
    switch (selector) {
    case 1:
        save->filter.input = value;
        break;
    case 6:
        save->destination = value;
        break;
    }
    return 0;
}


