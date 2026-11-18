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
- {Idea}: {what happened} -> {why it didn't work}
- {Idea}: {what happened} -> {why it didn't work}

## Solution
### Step 1: {what this step achieves}
{Why you took this step, what you expected, what you saw.}

### Step 2: {what this step achieves}
{Reasoning first, then the minimum command or code.}

```{language}
# solve script: minimal, commented, no hardcoded secrets
{code}
```

![{Describe what the screenshot shows}](img/{file}.png)

## Flag
`Password for bandit10`

## Lessons learned
- {What you'd check first next time}
- {Tool or technique you learned}
- {What made the challenge click}

## References
- [Piping and Redirection](https://ryanstutorials.net/linuxtutorial/piping.php)
- [12 Practical Examples of Linux Grep Command](https://www.tecmint.com/12-practical-examples-of-linux-grep-command/)
- [strings Command in Linux](https://www.tutorialspoint.com/unix_commands/strings.htm)