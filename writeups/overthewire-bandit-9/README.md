# OverTheWire: Bandit Lvl 9 (Linux): Bandit (2026)

| Field      | Value |
|------------|-------|
| Platform   | OverTheWire |
| Event      | Bandit |
| Date       | 2026 |
| Category   | Linux |
| Difficulty | Easy |
| Points     | N/A |
| Solves     | 0 |
| Author     | OverTheWire |
| Solved by  | leeadrian841 |
| Status     | Solved |
| Tags       | Linux |

## TL;DR
The password for the next level is stored in the file `data.txt` in one of the few human-readable strings, preceded by several ‘=’ characters.

## Challenge
> Find the password for the next level which is stored in the file `data.txt`in one of the few human-readable strings, preceded by several ‘=’ characters.

- Files: `data.txt` (Base64 encoded)
- Service: `bandit9@bandit.labs.overthewire.org:2220` (online)

## First look
After I had ran `file` for the `data.txt` file, I realized that it doesn't contain `ASCII text` but `data` instead. `Data` can contain almost anything, ranging from random bytes and compiled machine code to mixed text and raw binary.

I ran `head` to confirm my assumptions and saw that the weird output contained symbols.

### Output for `file`
| Output | Human-readable? | What it means |
|--------|-----------------|---------------|
| ASCII text | Yes | Basic English characters, numbers, and symbols only. |
| UTF-8 Unicode text | Yes | Modern text supporting international scripts and emojis. |
| UTF-16 Unicode text | Yes | 2-byte per character encoding, often originating from Windows. |
| ISO-8859 text | Yes | Legacy 8-bit regional character encoding (e.g., Western European). |
| data | No | Unrecognized raw binary bytes; not safe to edit as plain text. |

```bash
ssh bandit9@bandit.labs.overthewire.org -p 2220
Password: {Password for bandit9}

bandit9@bandit:~$ ls
data.txt
bandit9@bandit:~$ file data.txt
data.txt: data
bandit9@bandit:~$ head data.txt
v����n�Z.|H�.�� l��ŕxg���o<�,�ȫ)
�����!�                         M25�
       �*IsU
            ҧ䃘�[i��ΥU����_WnZ�_k��ĳ*�t�3����u���!��Uo���r�*_5���T�9-�OS�&�b�=a�ׅƞ�]S�=�tv3$Y����a��%�o����:ou�␦�=)Ҿ������cJʱ�:��>M���11���fk:@������mB�aAb{ؘ�Q�#|bsG�?�˱�%C+����g�3�$�z�N�$����P�9��'��ɶ�y�4��]�Y�e�۠�Fdy��=���:k놣D`.
                                                                                                            �l���Tl��Ė����� ���C��I��3��f��@���C�b|��[�O�O��
                                    ���k�jN�&����T���˼yl��Tt}�y��ǒ��l<p�]
                                                                         \HRՒ�)yJ�z�@i͉�[[������ V���k��-^h���疷CZ␦E+g�B�:�␦3�؁���b�,�I������������g�驌�8�d���?WCb����Gk}������󀕼�#N�:����}�bL�V��K+�G����{�2�`�ϴQ�'}.0�ݕdC8�4LSwe�        c�()�A��C�ni���w}�]��VR�*�yG���
                       6{vLqjp���f��u����aD~�θ5շ"��[�A�"��]�m�e�Չ=��Q?��/�/y������6�.�������R��cӼ
���UP���c]8{�0����r�C�ygԽ�C���7�z�q�
���9�}E�ŌWf�]��
�=����J��K��zx�qR٣�h̃:r,����&����D�Y�����[@fhq-�m�Ŕ7��1q�yC���L�#��,GG`�y�
=}Q���u>�a�>�i�w�;�QG␦L)I�ǫX����8a�ӇK5��S2�W/��␦;y���ܙ�7�Fo厒���q%������:x6�
��Ѯ�qAi3ヅ��C(z?U����7j���H���yu�ۋ��)G�@�XN����HKp:D'P��G+R�:�p���`=Sc�␦<�7�}7;========== the
R��ϱ��:4)���k/ڿ���EMn�8
��H��eD��和u    >�����H␦��t��~��s��u|��\�Q�q�yME�qŵ�u�<D��@20՜�L���˙�&
                                                                      ��y�P-�0wh�d��֐�ӝ)�<�om���zw��Ȳ?���5�8Pյ�X#�dv���i"�      �3sQ�$3/y�ߵ������Ƙf�[R���<dd�|z�P�f���YSҐ^y��5��[��>RYV�uP��F���E �U+�f�
                                                                                ���F�ѧ̘���h~<ۇzc.
␦ϓ��/o�%|L���[�n��K�r:+YS�^ԕ�|�vK[�t���ʹM��ƛڍ�3r�xt̉��]<�ڊeX3Z����ot�v����U���5G�fLK�������7v�O���A���X���䓗8Ѵ}�,�]���]��iA��5:��8�0��=��T���qm
_��t�i�ƻ��7����g�U)�~�:R��D�+R�#�ڰ`4�&�*��t��L�f;��aܤ��!���-!D�h:���q�����8��Ȟ*����ݢ\.��sl/���֚K�l|-n���G�h�'����T����f�����m/�!l�W�W��К��f�F��Z2�'Su���'�\9�<��]̚G,rD%_�Q�)�
                                                   +V�wJ�c��3�`�␦�x}�T`����PG�����!�Ή�kr�-�m��4�C6=��ѫ �Q�ǂ�����֊��������H�B���uC�O塏_��`?�t'�ۉTִ�֑iUǍZ�}��@���1$�d�0�����[����=�VpP��I3�-m`BF��B���1�7��<n��$kO�.�*���)>(�DUӬ�r��RA��^g�R��>��k���f*�R��n�<���������X�s��        {��`����`!o��և#�8zkҺ�b�|C��;�␦B�ttb:ȫ_g���D)�␦�E
                                                                                �v�ݯ���A�����7��_B���<��i��H�v:�;J�n�ef����zH$�L�<rOz�Z�kc�`���D�)�:�B1J��K���Oe��(�+�v��k�:�x�r��0�w�Hģ�}&;���OP���d��)����U����\^Q
                                                                               ��Q����+j�(R�n���d����R��Y�����Tvx�(v���ʵM�8␦Y��~ߎД�kA*�u��?گ��S����/�ي�j_�:i+�k�o�e�"���ɘ#�ﭣo�Lŉ�.8���q%�(L�0��7{��h�у�^
                                                                                �4�xQ���cG}RK&���ƽu�� gy�D�W�fRq����E_���)�)oO#5EW ␦��.?�3�J�Z��L$��T���{S�G-ɿUHߤ�*������`��z}��Iv�m����k�*�DE��^c�l��j�79�����␦m=��nIY�Wb�i�=��x�
                                                                                                          ��9�c��o��`��x��J��js�/HܲQ}!�'�ƾ��h���Ţ(���_�����{��q篁�{{��}��␦j�׬۶���W�㮠�T�S�y�v��lFckF�����x�-�"���Z��
                                                                                                ,]����,��&p���b��8�D�w+�D#ݻ
   �S�f��>�Ԣ�Nx����F�����8p�|�My���~���t{�g�vɺ-c=,�ê՛�qA��|OE~�D����-���;�\(\(�����{.�8�������,K�m�=�0C��/^���s�_�MY��
                                                                                                                      )"��pIg��]Z����r�?)�pG������0�f�3����Ĺ�=9lj�F�~�e��͙�a��Ϧ8�}�')�Ks���;�*�xcd��%����W+�⮚��5D��,"�)/���'��E�.�fq�hy��6-JycW�����7��,�նn�ц��H�}FZ�<����7ϻ<�n�lw�$�e
|Ⱦ�␦�R��2B�GMH@!����L�!��鏚P\��p�}␦<��gj��c+�ͯ"O0ݯ{�:�.�hy�%Un�M�pގ
                                                                  >�2   ����NgEUհŪ�,A�>���rY��[
                                                                                              ���:5��8��3�P��BIQ7��;ߘ�2c�6�C�w�5��-����vgǓ�9&���%4KyMB���U�����L�8
                                          b�O+po����|KK2.�k=�w&�'8�d~��)�Co�C��<�]���r|��7�`����Ӷ[��z�P�+m�9��3�H���4���K ?����
�����x���v�}�iM��ذP�\)��9;D���w��)j$�;��1.g���>��P��:���(���T��u���$f�E��r�\ǕU��'o
```

## Dead ends
- `cat data.txt`: terminal filled with garbage characters -> the file is binary, so most bytes are not printable text.
- `grep "==" data.txt`: returned only `binary file matches` -> grep detected binary content and suppressed the output.
- `grep -a "==" data.txt`: printed the match buried in junk bytes -> `-a` forces text mode but keeps the noise; workable, not clean.
- Trusting the `.txt` extension: assumed plain text -> `file data.txt` returned `data`; Linux ignores extensions and `file` found no known signature.
- `wc -l data.txt` = 71: assumed 71 readable lines -> `wc -l` counts `0x0A` bytes, which appear randomly in binary data.
- `strings data.txt | grep "="`: too many results to scan -> a single `=` is common in random strings; `==` or `===` cuts the noise.
- `sort data.txt | uniq -u` (Level 8 method): no useful output -> wrong clue; Level 9 is about readable strings, not unique lines.

## Solution
### Step 1: Use `strings` to get human-readable text
The `data.txt` file contained data so this can be almost anything, ranging from random bytes and compiled machine code to mixed text and raw binary. I had to use `strings data.txt | head` to partially output the human-readable text. You wouldn't want to see the entire `strings` output which is quite long actually.

```bash
bandit9@bandit:~$ strings data.txt | head
Z.|H
*IsU
_WnZ
tv3$Y
y`Y@
fk:@
aAb{
#|bsG
OWCb
'}.0
```

### Step 2: Chaining `strings` with `grep` to get the favourable lines
For my 1st attempt, I used `cat data.txt | strings -e s | grep ==` to get the lines that I needed to output. After understanding how it worked, I considered to make the command cleaner.

As for the next few attempts, I understood how `strings` and `grep` can work together to produce a cleaner output. I produced a cleaner output by chaining both `strings` and `grep` into 1 command `strings data.txt | grep '==='`. This command pulled out all the human-readable text and then filtered those lines that had `===`.

```bash
# My 1st attempt
bandit9@bandit:~$ cat data.txt | strings -e s | grep ==
========== the
[==p+
========== password
Y========== is
========== {Password for bandit10}

# Alernative without strings
bandit9@bandit:~$ grep -a '===' data.txt
��Ѯ�qAi3ヅ��C(z?U����7j���H���yu�ۋ��)G�@�XN����HKp:D'P��G+R�:�p���`=Sc�␦<�7�}7;========== the
�ł�PJ�@ j,~��%1o-��U��P#rB�ffv�X(Mt�����&+E     ��X�=��+��IӄDO�-���=� M�g ���϶��n���s�f�y�=�H�f�#ڪ�O���rN��=����1d^]6-�VY���o�YcN��CC�J.��.{J�������========== password
�Y݀��qR��� o��<`J������8ۻ�.��Oj(%qy=׎���>�)PcYa���޴����,g�
                                                         �
                                                          z     /rG%�T!j5㎓5�v�� ��5@�H������========== is
u�w�C�ɺ�`.KdIX�Q%�-�-g�========== {Password for bandit10}

# Cleaner version
bandit9@bandit:~$ strings data.txt | grep '==='
}7;========== the
========== password
========== is
========== {Password for bandit10}
```

### Useful follow-ups
```bash
wc -c data.txt          # size in bytes
xxd data.txt | head     # hex view of the first bytes
strings data.txt | wc -l   # how many readable strings exist
```

## Flag
`Password for bandit10`

## Lessons learned
- Learn how to chain commands to get cleaner output.
- Learn how to handle different contents for files.

## References
- [Piping and Redirection](https://ryanstutorials.net/linuxtutorial/piping.php)
- [12 Practical Examples of Linux Grep Command](https://www.tecmint.com/12-practical-examples-of-linux-grep-command/)
- [strings Command in Linux](https://www.tutorialspoint.com/unix_commands/strings.htm)