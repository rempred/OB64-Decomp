typedef unsigned int u32;
typedef unsigned short u16;
typedef struct { int v[6]; float f[2]; unsigned char index; } Output;
extern int func_002015C8(int, int, int, int);
extern void func_0020626C(int, int *, int *, int *, int *);
extern u32 *func_002060EC(int);
int func_00205484(int a, int b, int c, int d, int directoryIndex, u32 selected, Output *out)
{
    int p0, p1, p2, p3;
    int handle = func_002015C8(a, b, c, d);
    u32 *directory;
    u16 *p;
    int result;
    func_0020626C(handle, &p0, &p1, &p2, &p3);
    if (directoryIndex == p0) {
        directoryIndex = p1;
        out->v[5] = 0x40;
    } else if (directoryIndex == p2) {
        directoryIndex = p3;
        out->v[5] = 0x80;
    } else {
        out->v[5] = 0;
    }
    directory = func_002060EC(handle);
    if (directory != 0) p = (u16 *)((u32)directory + directory[directoryIndex]);
    else p = 0;
    if (selected >= *p++) result = 0;
    else {
        p += selected * 8;
        out->index = selected;
        out->v[0] = p[0];
        out->v[1] = (short)p[1];
        out->v[2] = (short)p[2];
        out->v[3] = p[3];
        out->v[4] = p[4];
        out->v[5] |= p[5];
        out->f[0] = (float)(p[6] >> 10) + (float)(p[6] & 0x3FF) / 1024.0f;
        out->f[1] = (float)(p[7] >> 10) + (float)(p[7] & 0x3FF) / 1024.0f;
        result = 1;
    }
    return result;
}
