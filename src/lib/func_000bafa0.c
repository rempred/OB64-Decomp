typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_80196AF8;
typedef struct {
    u8 b[0x36];
} SquadRec87;
extern u8 g_func_001957D0_active_source_ids[];
typedef struct {
    u8 pad[0x117C];
    SquadRec87 sq[1];
} Save87Squads;
void func_000bafa0(void) {
    u8 seen[30];
    s32 i;
    s32 n;
    bzero(seen, 30);
    n = 0;
    for (i = 0; i < 30; i++) {
        s32 g = g_func_001957D0_active_source_ids[i];
        if (g != 0xFF && ((Save87Squads *)D_80196AF8)->sq[g].b[3] != 0xFF) {
            if (++seen[g] == 1) {
                g_func_001957D0_active_source_ids[n] = g;
                n++;
            }
        } else {
            g_func_001957D0_active_source_ids[n] = 0xFF;
        }
    }
    for (i = 0; i < 30; i++) {
        if (((Save87Squads *)D_80196AF8)->sq[i].b[3] != 0xFF && seen[i] == 0) {
            g_func_001957D0_active_source_ids[n] = i;
            n++;
            seen[i]++;
        }
    }
    if (n < 30) {
        g_func_001957D0_active_source_ids[n] = 0xFF;
    }
}
