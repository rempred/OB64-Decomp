typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u8 unk00[0x11];
    u8 cls;
    u8 baseCls;
    u8 level;
    u8 gender;
    u16 maxHp;
    u16 hp;
    u8 element;
    u8 alignment;
    u16 str;
    u16 vit;
    u16 intl;
    u16 men;
    u16 agi;
    u16 dex;
    u8 luck;
    u16 items[4];
    u8 fatigue;
    u8 status;
} Character;
typedef struct {
    Character c;
    u8 pad[4];
} PlayerChar;
extern PlayerChar D_80193BC0_copy[];
typedef struct {
    u16 id;
    u8 equipped;
    u8 count;
} StockEntry;
u16 D_8016B6FC(u16 k);
extern StockEntry D_80196B00[];
void func_000bb1ec(u8 k) {
    Character *c = &D_80193BC0_copy[k].c;
    s32 i;
    u16 id;
    for (i = 0; i < 4; i++) {
        switch (i) {
            case 0:
                id = c->items[0];
                c->items[0] = 0;
                break;
            case 1:
                id = c->items[1];
                c->items[1] = 0;
                break;
            case 2:
                id = c->items[2];
                c->items[2] = 0;
                break;
            default:
                id = c->items[3];
                c->items[3] = 0;
                break;
        }
        if (id != 0) {
            D_80196B00[D_8016B6FC(id)].equipped--;
        }
    }
}
