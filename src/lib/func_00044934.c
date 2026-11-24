typedef unsigned char u8;

typedef struct ClassEntry {
    u8 unk_00[0x15];
    u8 first_history_class_id;
    u8 first_history_level_cutoff;
    u8 second_history_class_id;
    u8 second_history_level_cutoff;
    u8 related_class_19;
    u8 unk_1A[0x2E];
} ClassEntry;

/* Resolve the historical class at the requested level. */
int func_00044934(u8 primary_class_id, u8 secondary_class_id, int level)
{
    int offset;
    u8 threshold;
    u8 selected_class;

    selected_class = primary_class_id;
    if (((ClassEntry *)0x80187C40)[selected_class & 0xFF].related_class_19 != (secondary_class_id & 0xFF)) {
        selected_class = secondary_class_id;
    }

    /* Keep the byte offset: direct array indexing makes KMC retain a table
     * base register and changes the retail branch/addressing sequence. */
    offset = (selected_class & 0xFF) * sizeof(ClassEntry);
    threshold = ((ClassEntry *)(offset + 0x80187C40))->first_history_level_cutoff;
    if (threshold != 0xFF && (unsigned int)(level & 0xFF) < threshold) {
        selected_class = ((ClassEntry *)(offset + 0x80187C40))->first_history_class_id;
    } else {
        offset = (selected_class & 0xFF) * sizeof(ClassEntry);
        threshold = ((ClassEntry *)(offset + 0x80187C40))->second_history_level_cutoff;
        if (threshold != 0xFF && (unsigned int)(level & 0xFF) < threshold) {
            selected_class = ((ClassEntry *)(offset + 0x80187C40))->second_history_class_id;
        }
    }

    return selected_class & 0xFF;
}
