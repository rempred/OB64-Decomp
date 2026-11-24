typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;

typedef struct BodyFilterRow {
    u8 pad00[0xF6];
    u8 member_index;
} BodyFilterRow;

extern u8 D_8022A7F0;
extern u8 D_801976DC;
extern u8 D_801976E8;
extern u16 D_80193BD8[];
extern u8 D_80193BF3[];
extern u16 D_80190EBC[];
extern u8 D_80191010[];
extern u16 D_80195578[];
extern u8 D_80195593[];
extern u16 D_8019532C[];
extern u8 D_80195480[];
extern s32 func_0020C014(void *actor);

/* Filter battle actors using persistent HP and status. */
u8 func_002AD574(void *actor)
{
    BodyFilterRow *actor_view = actor;
    u8 context;
    u8 excluded;
    s32 uses_army_roster;
    u8 member_index;
    s32 member_byte_offset;
    s32 blocked;

    /* Keep this byte load in the folded entry. */
    context = D_8022A7F0;
    excluded = 0;
    if (context == 1) {
        return 0;
    }
    if (func_0020C014(actor) != 0) {
        uses_army_roster = D_801976DC < 30;
    } else {
        uses_army_roster = D_801976E8 < 30;
    }
    if (uses_army_roster) {
        member_index = actor_view->member_index;
        if (member_index < 100) {
            member_byte_offset = member_index * 0x38;
            if (*(u16 *)((u8 *)D_80193BD8 + member_byte_offset) == 0) {
                excluded = 1;
            }
            blocked = D_80193BF3[member_byte_offset] & 4;
        } else {
            if (D_80190EBC[member_index] == 0) {
                excluded = 1;
            }
            blocked = D_80191010[member_index] & 4;
        }
    } else {
        member_index = actor_view->member_index;
        if (member_index < 100) {
            member_byte_offset = member_index * 0x34;
            if (*(u16 *)((u8 *)D_80195578 + member_byte_offset) == 0) {
                excluded = 1;
            }
            blocked = D_80195593[member_byte_offset] & 4;
        } else {
            if (D_8019532C[member_index] == 0) {
                excluded = 1;
            }
            blocked = D_80195480[member_index] & 4;
        }
    }
    if (blocked != 0) {
        excluded = 1;
    }
    return excluded;
}
