typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;

typedef u16 (*ClassScreenCheck)(u8, u8);

extern u32 * volatile D_800E9BA0;
extern u8 * volatile D_80196AF8;
extern ClassScreenCheck D_801EF288[];

s32 func_000415fc(u16);
void func_00087200();
void func_00087b30();
u16 func_000bb3d8(s32, s32, s32);
s16 func_000bb47c(s32, s32, s32);
s32 func_000bf228(u16, s32, u16);
void *memset_00023780(void *, s32);

void func_0009fa70(void *unused, u8 *screen, s32 slot)
{
    u16 stack_values[12];
    s16 color;
    s32 x;
    s32 y;
    s32 i;
    u32 *commands;
    u8 *state;

    color = *(s16 *)(screen + ((slot & 0xFF) * 2) + 0xE0);
    if (color == 0) {
        return;
    }

    {
        u32 first_mode = 0xE3000C00;
        u32 second_mode = 0xE3001201;

        x = *(volatile s32 *)(screen + 0x0C);
        commands = D_800E9BA0;
        y = *(volatile s32 *)(screen + 0x10);
        D_800E9BA0 = commands + 2;
        commands[0] = 0xFA000000;
        commands[1] = color | 0xFFFFFF00;
        D_800E9BA0 = commands + 4;
        D_800E9BA0 = commands + 6;
        commands[2] = first_mode;
        commands[3] = 0;
        commands[4] = second_mode;
        commands[5] = 0;
        if (color == 0xFF) {
            commands[6] = 0xE200001C;
            commands[7] = 0x0F0A7008;
        } else {
            commands[6] = 0xE200001C;
            commands[7] = 0x00504240;
        }
        D_800E9BA0 = commands + 8;
    }

    commands = D_800E9BA0;
    state = D_80196AF8;
    i = 0;
    commands[1] = 0xFF2FFFFF;
    commands[2] = 0xDE000000;
    commands[0] = 0xFC119623;
    commands[3] = 0x801EE868;
    D_800E9BA0 = commands + 2;
    D_800E9BA0 = commands + 4;
    func_00087b30(*(s32 *)(state + 8) + 0x3E0,
                  *(s32 *)(state + 4) + 0x34C8,
                  0x10, 0x10, 2);
    do {
        func_00087200(x + ((i & 1) * 0x16) + 6,
                      y + ((i / 2) * 0x16) + 0x0A,
                      0x13);
        i++;
    } while (i < 4);

    state = D_80196AF8;
    if (state[0x60C] == 0) {
        return;
    }

    {
        u8 selection = state[0x18B];
        u16 *first_base = stack_values;
        u16 *second_base = stack_values + 8;

        memset_00023780(first_base + 4, 8);
        i = 0;
        do {
            s32 next = i + 1;
            s32 masked_next = next & 0xFF;
            u16 *first_cursor = first_base + i;
            u16 *second_cursor;
            u16 second;

            first_cursor[4] = func_000bb3d8(0, selection, masked_next);
            second = func_000bb47c(0, selection, masked_next);
            second_cursor = second_base + i;
            *second_cursor = second;
            if (first_cursor[4] == second) {
                *second_cursor = 0;
            }
            i = next;
        } while (i < 4);
    }

    state = D_80196AF8;
    commands = D_800E9BA0;
    D_800E9BA0 = commands + 2;
    commands[0] = 0xFD100000;
    commands[1] = *(u32 *)(state + 0x18);
    D_800E9BA0 = commands + 4;
    commands[2] = 0xE8000000;
    commands[3] = 0;
    D_800E9BA0 = commands + 6;
    commands[4] = 0xF5000100;
    commands[5] = 0x07000000;
    D_800E9BA0 = commands + 8;
    commands[6] = 0xE6000000;
    commands[7] = 0;
    D_800E9BA0 = commands + 10;
    commands[8] = 0xF0000000;
    commands[9] = 0x073FC000;
    D_800E9BA0 = commands + 12;
    commands[10] = 0xE7000000;
    commands[11] = 0;

    if (state[0x5E9] == 0xFF) {
        return;
    }

    {
        u8 selection = state[0x5E9];
        ClassScreenCheck *check = D_801EF288;

        for (i = 0; i < 4; i++, check++) {
            u16 result = (*check)(selection, selection);

            if (result != 0) {
                u32 texture_offset = (((result - 1) & 0xFFFF) << 8) + 0x200;

                commands = D_800E9BA0;
                commands[0] = 0xFD500000;
                commands[1] = *(u32 *)(D_80196AF8 + 0x18) + texture_offset;
                D_800E9BA0 = commands + 2;
                D_800E9BA0 = commands + 4;
                commands[2] = 0xF5500000;
                commands[3] = 0x07000000;
                D_800E9BA0 = commands + 6;
                commands[4] = 0xE6000000;
                commands[5] = 0;
                D_800E9BA0 = commands + 8;
                commands[6] = 0xF3000000;
                commands[7] = 0x0707F400;
                D_800E9BA0 = commands + 10;
                commands[8] = 0xE7000000;
                commands[9] = 0;
                D_800E9BA0 = commands + 12;
                D_800E9BA0 = commands + 14;
                commands[10] = 0xF5480400;
                commands[11] = 0;
                commands[12] = 0xF2000000;
                commands[13] = 0x0003C03C;
                func_00087200(x + ((i & 1) * 0x16) + 6,
                              y + ((i / 2) * 0x16) + 0x0A,
                              0x1B, texture_offset);
            }
            stack_values[i] = result;
        }
    }

    for (i = 0; i < 4; i++) {
        u16 result = stack_values[i];

        if (result != 0) {
            s32 class_index = func_000415fc(result) & 0xFFFF;
            s32 blocked = 0;
            s32 scan;

            if (class_index != 0x1FF) {
                blocked = *(u8 *)(0x80196B02 + (class_index * 4))
                        < *(u8 *)(0x80196B03 + (class_index * 4));
            }

            for (scan = 0; scan < 8; scan++) {
                if (result == stack_values[4 + scan]) {
                    blocked++;
                    break;
                }
            }

            if ((blocked & 0xFF) == 0
                    && (*(u16 *)(D_80196AF8 + 0x12C) & 0x10)) {
                if (func_000bf228(result, scan + 1, result) & 0xFF) {
                    state = D_80196AF8;
                    func_00087b30(*(s32 *)(state + 0x64) + 0x240,
                                  *(s32 *)(state + 0x64) + 0xB8D8,
                                  0x10, 9, 2);
                    func_00087200(x + ((i & 1) * 0x16) + 5,
                                  y + ((i / 2) * 0x16) + 0x12,
                                  0x65);
                } else {
                    state = D_80196AF8;
                    func_00087b30(*(s32 *)(state + 0x64) + 0x220,
                                  *(s32 *)(state + 0x64) + 0xB868,
                                  0x20, 7, 2);
                    func_00087200(x + ((i & 1) * 0x16) + 4,
                                  y + ((i / 2) * 0x16) + 0x14,
                                  0x5A);
                }
            }
        }
    }
}
