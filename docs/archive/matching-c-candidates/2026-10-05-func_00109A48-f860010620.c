typedef unsigned char u8;
typedef unsigned int u32;
typedef int s32;

/* Partial view of the original flag word and signed sentinel-list pointer. */
typedef struct RuntimeUnit {
    u32 flags;
    u8 pad_04[0xA4];
    s32 *members;
} RuntimeUnit;

extern RuntimeUnit *D_801F0CB0[];
extern RuntimeUnit *D_801F0D28[];
extern u8 D_801969BA[][11];
extern s32 func_0012E968(RuntimeUnit *);

void func_00109A48(RuntimeUnit *unit)
{
    s32 scan_index = 30;
    RuntimeUnit **slot = D_801F0D28;

    do {
        RuntimeUnit *entry = *slot;
        u32 flags = entry->flags;

        scan_index++;
        if (!(flags & 8)) {
            if (flags & 0x20) entry->flags = flags | 0x800;
        }
        slot++;
    } while (scan_index < 50);

    {
        s32 index = 0;

    if (!(unit->flags & 0x40)) {
        if (unit->members != 0) {
            s32 member = unit->members[0];
            if (member != -1) {
                RuntimeUnit **bank = D_801F0CB0;
                u32 clear_mask;

                scan_index = 0;
                clear_mask = ~0x800U;
                do {
                    bank[member]->flags &= clear_mask;
                    scan_index++;
                    member = unit->members[scan_index];
                } while (member != -1);
            }
        }
    } else {
        do {
            /* The original repeats the call for each of the five bytes. */
            s32 source = D_801969BA[func_0012E968(unit)][index];
            RuntimeUnit **bank = D_801F0CB0;
            u32 clear_mask = ~0x800U;

            if (source != 0xFF) {
                RuntimeUnit *entry = bank[source];

                if (entry->members != 0) {
                    source = entry->members[0];
                    scan_index = 0;

                    if (source != -1) {
                        do {
                            bank[source]->flags &= clear_mask;
                            scan_index++;
                            source = entry->members[scan_index];
                        } while (source != -1);
                    }
                }
            }
            index++;
        } while (index < 5);
    }
    }
}
