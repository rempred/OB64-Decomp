typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef signed int s32;

extern u8 D_801971F2[][25];
extern u8 func_00043100(int primary_class, int alternate_class);

/* Sum the member class values using the squad's persistent roster. */
u32 func_0014F300(s32 source_word)
{
    u8 squad_source_index = (u8)source_word;
    u16 total = 0;
    s32 uses_army_roster = squad_source_index < 30;
    u8 *member_slots = D_801971F2[squad_source_index];
    s32 member_slot;

    for (member_slot = 0; member_slot < 5; ++member_slot) {
        u32 member_index = member_slots[member_slot];
        s32 present = member_index != 0;
        u8 below_limit = member_index < 100;
        if (present & below_limit) {
            /* Consume the byte result in its class-table branch. GCC 2.7
             * allocates the real sum before the cursor with this form, then
             * merges both source call sites into one emitted call. */
            if (uses_army_roster) {
                u8 *row = (u8 *)0x80190000 + member_index * 56;
                total += func_00043100(row[0x3BD1], row[0x3BD2]);
            } else {
                u8 *row = (u8 *)0x80190000 + member_index * 52;
                total += func_00043100(row[0x5571], row[0x5572]);
            }
        } else {
            if (!below_limit)
                ++total;
        }
    }
    return (u16)total;
}
