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
    s32 index = 30;
    RuntimeUnit **slot = D_801F0D28;

    do {
        RuntimeUnit *entry = *slot;
        u32 flags = entry->flags;

        if (!(flags & 8)) {
            if (flags & 0x20) entry->flags = flags | 0x800;
        }
        index++;
        slot++;
    } while (index < 50);

    if (unit->flags & 0x40) {
        for (index = 0; index < 5; index++) {
            /* The original repeats the call for each of the five bytes. */
            u8 source = D_801969BA[func_0012E968(unit)][index];

            if (source != 0xFF) {
                RuntimeUnit *entry = D_801F0CB0[source];

                if (entry->members != 0) {
                    s32 member_index = 0;
                    s32 member = entry->members[0];
                    u32 clear_mask = ~0x800U;

                    if (member != -1) {
                        do {
                            D_801F0CB0[member]->flags &= clear_mask;
                            member_index++;
                            member = entry->members[member_index];
                        } while (member != -1);
                    }
                }
            }
        }
    } else {
        if (unit->members != 0) {
            s32 member_index = 0;
            s32 member = unit->members[0];
            u32 clear_mask = ~0x800U;

            if (member != -1) {
                do {
                    D_801F0CB0[member]->flags &= clear_mask;
                    member_index++;
                    member = unit->members[member_index];
                } while (member != -1);
            }
        }
    }
}
