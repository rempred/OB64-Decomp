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
/* Read an equipment slot directly from the persistent character. */
u16 func_00152F0C(u8 table_mode, u8 character_index, u8 equipment_slot) {
    Character *character;
    u16 equipment_id;
    if (table_mode == 0) {
        character = &D_80193BC0_copy[character_index].c;
    } else {
        character = &D_80195560_copy[character_index];
    }
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
    return equipment_id;
}
