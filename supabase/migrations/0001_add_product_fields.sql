-- Add missing columns to products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS benefits TEXT[],
  ADD COLUMN IF NOT EXISTS mukhi INTEGER;

-- Update existing products with descriptions and benefits
UPDATE products SET 
  description = '1 Mukhi Rudraksha is the rarest and most powerful of all Rudrakshas. It represents Lord Shiva himself and is believed to bring supreme consciousness, liberation (Moksha), and unparalleled spiritual growth. Sourced directly from Nepal with a certified lab report.',
  benefits = ARRAY['Enhances meditation & focus', 'Brings liberation (Moksha)', 'Removes sins & negativity', 'Supreme spiritual power'],
  mukhi = 1,
  is_new = false
WHERE id = '1-mukhi-nepali';

UPDATE products SET 
  description = 'The Kaju (cashew) shaped 1 Mukhi Rudraksha is a more accessible form of the rarest bead. It holds similar spiritual properties to the round variety, representing Lord Shiva and bestowing clarity, focus, and divine blessings.',
  benefits = ARRAY['Promotes mental clarity', 'Spiritual growth', 'Reduces anxiety & stress', 'Blessings of Lord Shiva'],
  mukhi = 1
WHERE id = '1-mukhi-kaju';

UPDATE products SET 
  description = 'The 2 Mukhi Rudraksha represents the union of Shiva and Shakti (Ardhanarishvara). It is the bead of relationships, harmony, and emotional balance. This Nepali bead is premium quality and comes with a lab certificate.',
  benefits = ARRAY['Harmonizes relationships', 'Emotional balance', 'Unity & togetherness', 'Heals emotional wounds'],
  mukhi = 2,
  is_bestseller = true
WHERE id = '2-mukhi-nepali';

UPDATE products SET 
  description = 'The 3 Mukhi Rudraksha represents Lord Agni (Fire God) and the Trinity of Brahma, Vishnu, and Mahesh. It is known to burn past karma, liberate from the cycle of birth and death, and bestow confidence and vitality.',
  benefits = ARRAY['Burns past karma', 'Boosts confidence', 'Enhances vitality', 'Removes fear & inferiority complex'],
  mukhi = 3
WHERE id = '3-mukhi';

UPDATE products SET 
  description = 'The 4 Mukhi Rudraksha represents Lord Brahma, the creator. It is the bead of knowledge, creativity, and intelligence. Students and teachers greatly benefit from wearing this bead.',
  benefits = ARRAY['Enhances intelligence', 'Boosts creativity', 'Improves memory & learning', 'Blessings of Lord Brahma'],
  mukhi = 4
WHERE id = '4-mukhi';

UPDATE products SET 
  description = 'The 5 Mukhi Rudraksha is the most common and widely used Rudraksha, representing Lord Kalagni Rudra (a form of Shiva). It brings peace, health, and freedom. Suitable for all — men, women, and children alike.',
  benefits = ARRAY['Most versatile bead for all', 'Brings peace & health', 'Controls blood pressure', 'Protects from negative energies'],
  mukhi = 5
WHERE id = '5-mukhi';

UPDATE products SET 
  description = 'The 6 Mukhi Rudraksha represents Lord Kartikeya (Murugan), the son of Lord Shiva. It bestows willpower, wisdom, and helps overcome obstacles in life.',
  benefits = ARRAY['Increases willpower', 'Overcomes obstacles', 'Improves focus & determination', 'Blessings of Lord Kartikeya'],
  mukhi = 6
WHERE id = '6-mukhi';

UPDATE products SET 
  description = 'The 7 Mukhi Rudraksha represents Goddess Mahalakshmi and the seven Saptarshis (sages). It is the bead of prosperity, wealth, and abundance.',
  benefits = ARRAY['Attracts wealth & prosperity', 'Removes financial obstacles', 'Blessings of Goddess Lakshmi', 'Brings good luck & fortune'],
  mukhi = 7
WHERE id = '7-mukhi';

UPDATE products SET 
  description = 'The 8 Mukhi Rudraksha represents Lord Ganesha, the remover of obstacles. It helps overcome challenges, grants success in new ventures, and brings stability.',
  benefits = ARRAY['Removes obstacles', 'Success in new ventures', 'Brings stability & grounding', 'Blessings of Lord Ganesha'],
  mukhi = 8
WHERE id = '8-mukhi';

UPDATE products SET 
  description = 'The 9 Mukhi Rudraksha represents the nine forms of Goddess Durga (Navadurga). It bestows power, fearlessness, and protection from evil.',
  benefits = ARRAY['Bestows power & fearlessness', 'Protection from evil forces', 'Blessings of Goddess Durga', 'Enhances leadership qualities'],
  mukhi = 9
WHERE id = '9-mukhi';

UPDATE products SET 
  description = 'The 10 Mukhi Rudraksha represents Lord Vishnu (the preserver). It provides all-round protection, peace, and harmony. It helps overcome planetary doshas in the horoscope.',
  benefits = ARRAY['All-round protection', 'Overcomes planetary doshas', 'Brings peace & harmony', 'Blessings of Lord Vishnu'],
  mukhi = 10
WHERE id = '10-mukhi';

UPDATE products SET 
  description = 'The 11 Mukhi Rudraksha represents Lord Hanuman and the eleven Rudras. It bestows wisdom, right judgment, and protects from accidents and misfortunes.',
  benefits = ARRAY['Bestows wisdom & right judgment', 'Protects from accidents', 'Strength of Lord Hanuman', 'Enhances yogic powers'],
  mukhi = 11
WHERE id = '11-mukhi';

UPDATE products SET 
  description = 'The 12 Mukhi Rudraksha represents Lord Surya (Sun God) and Lord Vishnu. It bestows radiance, confidence, and leadership. Excellent for government officials, politicians, and leaders.',
  benefits = ARRAY['Radiance & confidence', 'Leadership qualities', 'Blessings of Lord Surya', 'Good for government work'],
  mukhi = 12
WHERE id = '12-mukhi';

UPDATE products SET 
  description = 'The 13 Mukhi Rudraksha represents Lord Indra and Lord Kamadeva. It fulfills all desires and wishes, and is considered the bead of charisma, attraction, and ultimate success.',
  benefits = ARRAY['Fulfills all desires', 'Charisma & attraction', 'Ultimate success in all fields', 'Blessings of Lord Indra'],
  mukhi = 13
WHERE id = '13-mukhi';

UPDATE products SET 
  description = 'The 14 Mukhi Rudraksha (Deva Mani) is one of the rarest and most precious beads. It activates the Ajna Chakra (third eye), enhancing intuition and decision-making.',
  benefits = ARRAY['Activates third eye (Ajna Chakra)', 'Supreme intuition', 'Protection from all negativity', 'Highly auspicious & rare'],
  mukhi = 14
WHERE id = '14-mukhi';

UPDATE products SET 
  description = 'The 15 Mukhi Rudraksha represents Lord Pashupatinath (a supreme form of Shiva). It elevates spiritual awareness to great heights and helps practitioners achieve a higher state of consciousness.',
  benefits = ARRAY['Elevated spiritual consciousness', 'Lord Pashupatinath blessings', 'Heals chronic diseases', 'Promotes overall well-being'],
  mukhi = 15
WHERE id = '15-mukhi';

UPDATE products SET 
  description = 'The extremely rare 16 Mukhi Rudraksha represents the 16 Kalas (phases) of the Moon and Lord Mahamrityunjaya Shiva. It is believed to protect from all forms of disease and premature death.',
  benefits = ARRAY['Ultimate protection from disease', 'Mahamrityunjaya blessings', 'Victory over death & disease', 'Extreme rarity adds special power'],
  mukhi = 16,
  is_new = true
WHERE id = '16-mukhi';

UPDATE products SET 
  description = 'This powerful SidhMala contains one bead of each Mukhi from 1 to 14, strung in a specific sacred order. It is considered the most complete and powerful Rudraksha mala, providing benefits of all 14 Mukhis simultaneously.',
  benefits = ARRAY['Benefits of all 14 Mukhis', 'Complete protection & prosperity', 'Supreme spiritual attainment', 'Ideal for serious practitioners']
WHERE id = '1-14-mukhi-sawar-sidhmala';

UPDATE products SET 
  description = 'A SidhMala featuring Kaju (cashew-shaped) 1 Mukhi bead along with beads from 2 to 14 Mukhi. A slightly more accessible version of the complete SidhMala, offering comprehensive benefits across all chakras.',
  benefits = ARRAY['Comprehensive chakra balancing', 'All-round life improvement', 'Powerful protective mala', 'One Kaju 1 Mukhi included']
WHERE id = '1-14-mukhi-kaju-sidhmala';

UPDATE products SET 
  description = 'A SidhMala made from Indonesian Rudraksha beads — smaller in size but equally powerful. Indonesian Rudraksha are known for their smooth texture and are a more affordable option.',
  benefits = ARRAY['Benefits of all Mukhis', 'Affordable alternative', 'Indonesian origin beads', 'Smooth texture & comfortable wear']
WHERE id = 'indonesian-sidhmala';

UPDATE products SET 
  description = 'The Gaurishankar Rudraksha is a naturally joined pair of two Rudrakshas, representing the divine union of Lord Shiva and Goddess Parvati. Extremely auspicious for married couples.',
  benefits = ARRAY['Marital harmony & happiness', 'Family bonding & love', 'Fertility blessings', 'One of rarest natural formations'],
  is_bestseller = true
WHERE id = 'gaurishankar-ganesh';

UPDATE products SET 
  description = 'The Garbh Gauri Rudraksha is a naturally formed bead that looks like a mother holding her child. It is extremely auspicious for expecting mothers, promoting safe pregnancy.',
  benefits = ARRAY['Safe pregnancy blessings', 'Mother-child bond', 'Protection during childbirth', 'Rare natural formation']
WHERE id = 'garbh-gauri';

UPDATE products SET 
  description = 'The Ganesh Mukhi Rudraksha has a natural trunk-like protrusion resembling Lord Ganesha''s trunk. It is believed to bestow Lord Ganesha''s direct blessings — removing all obstacles and bringing success.',
  benefits = ARRAY['Lord Ganesha direct blessings', 'Removes all life obstacles', 'Success in all ventures', 'Enhances intelligence & wisdom'],
  is_new = true
WHERE id = 'ganesh-mukhi';
