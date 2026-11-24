typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;

extern u8 D_80193BC0[];
extern u8 D_80195560[];

/* Read an equipment halfword from the selected persistent character table. */
u16 func_000bb3d8(s32 table_mode, u8 character_index, u8 slot)
{
    u8 *character_bytes;

    if ((table_mode & 0xFF) == 0) {
        character_bytes = D_80193BC0 + ((s32)character_index * 0x38);
    } else {
        character_bytes = D_80195560 + ((s32)character_index * 0x34);
    }

    switch (slot) {
    case 1:
        return *(u16 *)(character_bytes + 0x2A);
    case 2:
        return *(u16 *)(character_bytes + 0x2C);
    case 3:
        return *(u16 *)(character_bytes + 0x2E);
    default:
        return *(u16 *)(character_bytes + 0x30);
    }
}
