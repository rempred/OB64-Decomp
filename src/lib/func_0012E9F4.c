typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;

typedef struct { u32 flags; u8 source_index; } RuntimeUnit;
typedef struct { u8 bytes[11]; } DeploymentRow11;

extern DeploymentRow11 D_801969B8[];

s32 func_0012E9F4(void *unit)
{
    u32 source_index = ((u8 *)unit)[4];
    s32 row_index;
    for (row_index = 0; row_index < 10; row_index++) {
        DeploymentRow11 *row = &D_801969B8[row_index];
        u32 flags = row->bytes[1];
        s32 slot;
        if (!(flags & 1)) {
            continue;
        }
        if (*(u32 *)unit & 8) {
            if (flags & 0x80) {
                continue;
            }
        } else if (!(flags & 0x80)) {
            continue;
        }
        for (slot = 0; slot < 5; slot++) {
            if (row->bytes[slot + 2] == source_index) {
                return slot;
            }
        }
    }
    return -1;
}
