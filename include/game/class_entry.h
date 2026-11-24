#ifndef GAME_CLASS_ENTRY_H
#define GAME_CLASS_ENTRY_H

/* Shifted class-table view starting at +0x2C in the full 0x48-byte row. */
typedef struct ClassEntry {
    u16 field_00;
    u16 default_equipment_slot_0;
    u16 default_equipment_slot_1;
    u16 default_equipment_slot_2;
    u16 default_equipment_slot_3;
    u8 unk_0A[0x0F];
    u8 related_class_19;
    u8 unk_1A[0x2E];
} ClassEntry;

#endif
