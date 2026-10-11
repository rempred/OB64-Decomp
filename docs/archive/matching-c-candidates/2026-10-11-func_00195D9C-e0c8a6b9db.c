#include "game/scenario_source_record.h"

extern void *func_80070F30(s32);
extern void func_800712C4(void *);
extern void func_80093380(void *, s32);
extern u32 func_0014F300(s32);
extern void func_00130E60(u16, s32);

void func_00195D9C(u8 index, u8 preset0, u8 preset1, u8 preset2)
{
    u8 *buffer;
    u8 *destination;
    int capacity;
    int count;
    int phase;
    int kind;
    u32 sourceIndex;
    int updateInventory;
    u8 *scan;
    u8 *bufferEnd;
    u8 *destinationEnd;

    buffer = func_80070F30(20);
    func_80093380(buffer, 20);
    /* Retail consumes only the low16 bits of the accepted u32 result. Keep
     * the consumed value promoted for the later signed bounds. */
    capacity = (u16)func_0014F300(index);
    if (preset0 || preset1) {
        count = 0;
        goto construction_entry;
    }
    if (preset2) {
        count = 0;
construction_entry:
        phase = 0;
        if (phase < capacity) {
            /* Indexed stores let GCC derive the moving construction cursor
             * while retaining the separate logical count used by the bound. */
            do {
            switch (phase) {
            case 0:
                switch (preset0) {
                case 1:
                    buffer[count] = 1;
                    count += 5;
                    break;
                case 2:
                    buffer[count++] = 1;
                    buffer[count] = 1;
                    count += 3;
                    break;
                case 3:
                    buffer[count++] = 1;
                    buffer[count++] = 1;
                    buffer[count] = 2;
                    count += 4;
                    break;
                case 4:
                    buffer[count++] = 2;
                    buffer[count] = 2;
                    count += 3;
                    break;
                case 5:
                    buffer[count++] = 2;
                    buffer[count++] = 2;
                    buffer[count] = 3;
                    count += 4;
                    break;
                case 6:
                    buffer[count++] = 3;
                    buffer[count] = 3;
                    count += 3;
                    break;
                }
                phase = 1;
                break;
            case 1:
                switch (preset1) {
                case 1:
                    buffer[count++] = 4;
                    buffer[count++] = 4;
                    break;
                case 2:
                    buffer[count++] = 4;
                    buffer[count++] = 5;
                    break;
                case 3:
                    buffer[count++] = 5;
                    buffer[count++] = 5;
                    break;
                }
                phase = 2;
                break;
            case 2:
                switch (preset2) {
                case 1:
                    buffer[count++] = 6;
                    break;
                case 2:
                    buffer[count++] = 6;
                    buffer[count++] = 6;
                    break;
                }
                phase = 0;
                break;
            }
            } while (count < capacity);
        }
    }
    sourceIndex = index;
    destination = g_func_001957D0_source_records[sourceIndex].field_0D;
    func_80093380(destination, 10);
    if (preset0 || preset1 || preset2) {
        kind = 1;
        if (capacity != 0) {
            updateInventory = sourceIndex < 30;
            /* These are the retail signed address comparisons. The explicit
             * capacity-first sums preserve the emitted operand order. */
            destinationEnd = (u8 *)(capacity + (s32)destination);
            scan = buffer;
            bufferEnd = (u8 *)(capacity + (s32)buffer);
            do {
                if ((s32)scan >= (s32)bufferEnd) {
                    kind++;
                    scan = buffer;
                }
                if (*scan == kind) {
                    *destination++ = kind;
                    if (updateInventory)
                        func_00130E60(kind, 1);
                }
                scan++;
            } while ((s32)destination < (s32)destinationEnd && kind < 7);
        }
    }
    func_800712C4(buffer);
}
