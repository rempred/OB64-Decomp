#include "common/mus_channel.h"

void func_000135a0(MusChannel *arg0)
{
    s32 wait_one;
    u16 wait_count;
    s32 elapsed;
    u8 *cursor_1;
    u8 *cursor_2;
    u8 *cursor_3;
    u8 opcode_byte;
    s32 high_bits;

    wait_one = 1;
    while (1) {
        elapsed = arg0->unk14 + 0x100;
        wait_count = arg0->unkA2 - 1;
        arg0->unk14 = elapsed;
        arg0->unkA2 = wait_count;
        if ((u16)wait_count == 0) {
            cursor_1 = arg0->pvolume;
            arg0->pvolume = cursor_1 + 1;
            opcode_byte = *cursor_1;
            if ((u32)opcode_byte >= 0x80) {
                arg0->unkBC = opcode_byte & 0x7F;
                cursor_2 = arg0->pvolume;
                arg0->pvolume = cursor_2 + 1;
                opcode_byte = *cursor_2;
                if ((u32)opcode_byte >= 0x80) {
                    high_bits = (opcode_byte & 0x7F) << 8;
                    arg0->unkA2 = high_bits;
                    cursor_3 = arg0->pvolume;
                    arg0->pvolume = cursor_3 + 1;
                    opcode_byte = *cursor_3;
                    high_bits = high_bits + 2;
                    arg0->unkA2 = opcode_byte + high_bits;
                } else {
                    arg0->unkA2 = opcode_byte + 2;
                }
            } else {
                arg0->unkBC = opcode_byte;
                arg0->unkA2 = wait_one;
            }
        }
        if (arg0->unk14 - arg0->unk0C >= 0) {
            return;
        }
    }
}
