typedef unsigned int u32;
typedef unsigned char u8;

extern u32 *func_00206174(u32);
u32 func_002050AC(u32 handle, u32 directoryIndex, u32 selected, u8 *out0, u8 *out1, u8 *out2)
{
    u32 *directory = func_00206174(handle);
    u8 *p;
    u32 count, i;
    if (directory != 0)
        p = (u8 *)(directory[directoryIndex] + (u32)directory);
    else
        p = 0;
    count = *p++;
    for (i = 0; i < count; i++) {
        if (i == selected) {
            switch (*(u8 *)(0x801CEEE0 + *p)) {
            case 2:
                if (out0) *out0 = p[1];
                break;
            case 3:
                if (out0) *out0 = p[1];
                if (out1) *out1 = p[2];
                break;
            case 4:
                if (out0) *out0 = p[1];
                if (out1) *out1 = p[2];
                if (out2) *out2 = p[3];
                break;
            }
            return *p;
        }
        p += *(u8 *)(0x801CEEE0 + *p);
    }
    return 0;
}
