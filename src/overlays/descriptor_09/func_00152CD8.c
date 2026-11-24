typedef unsigned char u8;
typedef unsigned short u16;
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
extern Character D_80195560_copy[];
extern u16 (*D_80213068[])(u8 cls, u8 base);
u16 func_00152CD8(u8 side, u8 idx, u8 slot);
/* Read an equipment slot with a class-default fallback. */
u16 func_00152CD8(u8 table_mode, u8 character_index, u8 equipment_slot) {
    Character *character;
    u16 equipment_id;
    u8 cls;
    u8 secondary_class_id;
    if (table_mode == 0) {
        character = &D_80193BC0_copy[character_index].c;
    } else {
        character = &D_80195560_copy[character_index];
    }
    cls = character->cls;
    secondary_class_id = character->baseCls;
    equipment_id = 0;
    switch (equipment_slot) {
        case 1:
            equipment_id = character->items[0];
            break;
        case 2:
            equipment_id = character->items[1];
            break;
        case 3:
            equipment_id = character->items[2];
            break;
        case 4:
            equipment_id = character->items[3];
            break;
    }
    if (equipment_id == 0 && (equipment_slot != 0 & equipment_slot < 5)) {
        equipment_id = D_80213068[equipment_slot](cls, secondary_class_id);
    }
    return equipment_id;
}
