/* Extract the equipped item's max HP and strength growth bonus. */
unsigned int func_000457e4(int equipment_id) {
    return (unsigned char) (*(unsigned char *)((signed char *)((((equipment_id & 0xFFFF) << 5) + 0x80190000)) + (-0x3BDC))) >> 6;
}
