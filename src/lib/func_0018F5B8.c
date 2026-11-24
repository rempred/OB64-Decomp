struct Panel;
typedef unsigned char u8;
typedef signed int s32;
extern u8 D_8021B299[];
extern s32 D_801F0B9C;
extern void *D_8021B174;
extern s32 D_8021B2AC;
extern s32 D_8021B2A4;
void D_8017C384(struct Panel *);
extern void *D_8021B174;
extern s32 D_8021B2AC;
extern s32 D_8021B2A4;
void D_8017C384(struct Panel *);
extern s32 D_8021B2B4;
typedef struct {
    u8 unk0;
    u8 flags;
    u8 members[5];
    u8 pos[5];
    u8 rest[0xD];
} Squad18F;
extern Squad18F g_func_001957D0_source_records[];
extern s32 D_801F3658;
extern s32 D_801ED5B0;
extern u8 D_8021B290[];
extern s32 D_8021B2B0;
extern s32 D_8021B2B8;
extern u8 D_8021B330[];
void func_0018F474(void);
extern s32 D_801F3678;
void D_8020CDA0(s32 se);
void func_0018FA38(void);
void func_0018FAAC(void);
void func_0018F5B8(void) {
    s32 i;
    s32 j;
    u8 t;
    u8 f;
    s32 cur;
    if (D_801F0B9C == -1) {
        D_8021B2B0 = D_8021B290[D_801ED5B0];
    }
    func_0018FA38();
    cur = D_801F0B9C;
    if (cur != -1) {
        D_8021B2B4 = D_8021B290[D_801ED5B0];
        func_0018FAAC();
    } else if (D_8021B2AC != cur) {
        D_8017C384(D_8021B174);
        D_8021B2AC = cur;
    }
    if (D_8021B2A4 == 0) {
        return;
    }
    if (D_8021B2A4 > 0) {
        if (D_801F3678 < 0x80) {
        done:
            D_8021B2A4 = 0;
            return;
        }
        {
            if (D_801F0B9C == -1) {
                if (D_8021B290[D_801ED5B0] == 0) {
                    D_8020CDA0(9);
                    goto done;
                } else {
                    D_801F0B9C = D_801ED5B0;
                    D_8021B2A4 = 0;
                    D_8020CDA0(6);
                    func_0018F474();
                    return;
                }
            } else if (D_8021B330[D_801ED5B0] == 0) {
                i = 0;
                if (D_8021B290[D_801ED5B0] != 0) {
                    for (; i < 5; i++) {
                        if (g_func_001957D0_source_records[D_801F3658].members[i] == D_8021B2B0) {
                            break;
                        }
                    }
                    for (j = 0; j < 5; j++) {
                        if (g_func_001957D0_source_records[D_801F3658].members[j] == D_8021B290[D_801ED5B0]) {
                            break;
                        }
                    }
                    t = g_func_001957D0_source_records[D_801F3658].pos[i];
                    g_func_001957D0_source_records[D_801F3658].pos[i] = g_func_001957D0_source_records[D_801F3658].pos[j];
                    g_func_001957D0_source_records[D_801F3658].pos[j] = t;
                    D_8021B290[D_801F0B9C] = g_func_001957D0_source_records[D_801F3658].members[j];
                    D_8021B290[D_801ED5B0] = g_func_001957D0_source_records[D_801F3658].members[i];
                    t = D_8021B299[D_801F0B9C];
                    D_8021B299[D_801F0B9C] = D_8021B299[D_801ED5B0];
                    D_8021B299[D_801ED5B0] = t;
                } else {
                    for (; i < 5; i++) {
                        if (g_func_001957D0_source_records[D_801F3658].members[i] == D_8021B2B0) {
                            break;
                        }
                    }
                    g_func_001957D0_source_records[D_801F3658].pos[i] = D_801ED5B0;
                    D_8021B290[D_801ED5B0] = D_8021B290[D_801F0B9C];
                    D_8021B290[D_801F0B9C] = 0;
                    D_8021B299[D_801ED5B0] = D_8021B299[D_801F0B9C];
                    D_8021B299[D_801F0B9C] = 0;
                }
                D_8020CDA0(0);
                D_801F0B9C = -1;
            } else {
                D_8020CDA0(9);
                f = D_8021B330[D_801ED5B0];
                for (i = 0; i < 8; i++) {
                    if (f & 1) {
                        break;
                    }
                    f >>= 1;
                }
                D_8021B2B8 = i + 0x36;
            }
        }
        goto done;
    }
    if (D_801F0B9C != -1) {
        D_801ED5B0 = D_801F0B9C;
        D_801F0B9C = -1;
        D_8021B2A4 = 0;
    } else {
        D_8021B2A4 = -100;
    }
    D_8020CDA0(1);
}
void func_0018FA38(void);
void func_0018FAAC(void);
void D_8020CDA0(s32 se);
void func_0018F5B8(void);
