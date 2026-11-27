typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern s32 D_801F3658;
extern u8 D_801F365B;
extern u8 D_8021B45C;
extern u8 D_801971FD[][25];
extern u8 g_func_001957D0_source_records[];
u16 D_801FE190(u8 slot);
void D_801DCC48(u8 *sq);
void func_001A1F84(u8 k) {
    s32 cnt[2];
    u8 t;
    s32 d;
    s32 a;
    s32 b;
    s32 j;
    cnt[0] = D_801FE190(D_801F365B);
    cnt[1] = D_801FE190(D_8021B45C);
    d = k - cnt[0];
    if (d > 0) {
        a = k - 1;
        b = cnt[1] - 1;
        for (j = 0; j < d; j++) {
            t = D_801971FD[D_8021B45C][b];
            D_801971FD[D_8021B45C][b] = D_801971FD[D_801F3658][a];
            D_801971FD[D_801F3658][a] = t;
            a--;
            b--;
        }
    } else {
        a = k;
        b = cnt[1];
        for (j = -d; j > 0; j--) {
            t = D_801971FD[D_8021B45C][b];
            D_801971FD[D_8021B45C][b] = D_801971FD[D_801F3658][a];
            D_801971FD[D_801F3658][a] = t;
            b++;
            a++;
        }
    }
    D_801DCC48(&g_func_001957D0_source_records[D_801F3658 * 25]);
    D_801DCC48(&g_func_001957D0_source_records[D_8021B45C * 25]);
}
