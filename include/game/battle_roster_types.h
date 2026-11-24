#ifndef OB64_GAME_BATTLE_ROSTER_TYPES_H
#define OB64_GAME_BATTLE_ROSTER_TYPES_H

/* Scene slots and temporary battle actors use the same 0xF8-byte record.
 * Class IDs have both a full-word and a low-byte view. */
typedef union BattleRosterClassWord {
    int word;
    struct BattleRosterClassBytes { unsigned char high[3]; unsigned char low; } bytes;
} BattleRosterClassWord;

typedef struct RosterRow {
    void *primary_children[3];
    void *secondary_children[3];
    unsigned char unknown18[8];
    unsigned short hp, max_hp, strength, vitality;
    unsigned short intelligence, mentality, agility, dexterity;
    unsigned char luck, level, experience, element, alignment, field_35;
    unsigned short equipment_slot_0, equipment_slot_1, equipment_slot_2, equipment_slot_3;
    /* Reference alignment is kept separately from current alignment. */
    unsigned char fatigue, reference_alignment;
    unsigned int battle_flags;
    int unknown44;
    BattleRosterClassWord primary_class_id;
    BattleRosterClassWord secondary_class_id;
    int body_resource_key;
    int formation_column;
    int formation_row;
    unsigned int world_x;
    unsigned char world_y_bytes[4];
    unsigned int world_z;
    unsigned char target_actor_index_bytes[4];
    int actions_used;
    int action_limit;
    unsigned char unknown74[4];
    unsigned char action_kind;
    unsigned char unknown79[3];
    unsigned int action_id;
    unsigned char unknown80[0x14];
    int scheduled_time;
    unsigned char unknown98[0x5E];
    unsigned char member_index;
    unsigned char unknownF7;
} BattleRosterRecord;

typedef char BattleRosterRecordSizeCheck[sizeof(BattleRosterRecord) == 0xF8 ? 1 : -1];

#endif
