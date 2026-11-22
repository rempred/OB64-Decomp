#ifndef OB64_GAME_BATTLE_ROSTER_RECORD_H
#define OB64_GAME_BATTLE_ROSTER_RECORD_H

/* The scene table and the battle-side temporary both hold complete records.
 * Keep the word and low-byte views used by the roster consumers. */
typedef union BattleRosterClassWord {
    int word;
    struct { unsigned char high[3]; unsigned char low; } bytes;
} BattleRosterClassWord;

typedef struct RosterRow {
    void *links[3];
    void *partners[3];
    unsigned char unknown18[8];
    unsigned short field20, field_22, field_24, field_26;
    unsigned short field_28, field_2A, field_2C, field_2E;
    unsigned char field_30, field_31, field_32, field_33, field_34, field_35;
    unsigned short field_36, field_38, field_3A, field_3C;
    unsigned char field_3E, field_3F;
    unsigned int flags40;
    int unknown44;
    BattleRosterClassWord class48;
    BattleRosterClassWord variant4C;
    int handle50;
    int column54;
    int row58;
    unsigned char unknown5C[0x1C];
    unsigned char field78;
    unsigned char unknown79[3];
    unsigned int field7C;
    unsigned char unknown80[0x14];
    int field94;
    unsigned char unknown98[0x5E];
    unsigned char fieldF6;
    unsigned char unknownF7;
} BattleRosterRecord;

typedef char BattleRosterRecordSizeCheck[sizeof(BattleRosterRecord) == 0xF8 ? 1 : -1];

void func_0020C908(BattleRosterRecord *record, int index);

#endif
