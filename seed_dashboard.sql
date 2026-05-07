DO $$
DECLARE
  t1u INT; t2u INT; t3u INT; t4u INT; t5u INT;
  t1t UUID; t2t UUID; t3t UUID; t4t UUID; t5t UUID;
  l_ids INT[];
  lid INT;
  bk_id UUID;
  bk_date TIMESTAMP;
  bk_price NUMERIC;
  bk_status VARCHAR;
  bk_subject VARCHAR;
  bk_tutor_uid INT;
  bk_tutor_tid UUID;
  i INT;
  d INT;
  subjects VARCHAR[] := ARRAY[
    'Calculo Diferencial','Algebra Lineal','Fisica Mecanica',
    'Programacion Python','Estadistica','Ecuaciones Diferenciales',
    'Bases de Datos','Quimica General','Ingles B2','Termodinamica'
  ];
  prices NUMERIC[] := ARRAY[60000,70000,80000,90000,100000,110000,120000,130000,140000,150000];
  statuses VARCHAR[] := ARRAY['completed','completed','completed','completed','completed','completed','confirmed','confirmed','pending','cancelled'];
  ratings SMALLINT[] := ARRAY[5,5,5,5,5,4,4,4,3,2];
BEGIN

  -- 1. Tutor users
  INSERT INTO "user" (clerk_id,email,first_name,last_name,role,status,created_at)
  VALUES ('user_seed_t001','carlos.mora@tc.co','Carlos','Mora','TUTOR','ACTIVE', NOW() - INTERVAL '60 days')
  RETURNING id INTO t1u;
  INSERT INTO "user" (clerk_id,email,first_name,last_name,role,status,created_at)
  VALUES ('user_seed_t002','sofia.reyes@tc.co','Sofia','Reyes','TUTOR','ACTIVE', NOW() - INTERVAL '55 days')
  RETURNING id INTO t2u;
  INSERT INTO "user" (clerk_id,email,first_name,last_name,role,status,created_at)
  VALUES ('user_seed_t003','andres.villa@tc.co','Andres','Villa','TUTOR','ACTIVE', NOW() - INTERVAL '50 days')
  RETURNING id INTO t3u;
  INSERT INTO "user" (clerk_id,email,first_name,last_name,role,status,created_at)
  VALUES ('user_seed_t004','laura.garcia@tc.co','Laura','Garcia','TUTOR','ACTIVE', NOW() - INTERVAL '45 days')
  RETURNING id INTO t4u;
  INSERT INTO "user" (clerk_id,email,first_name,last_name,role,status,created_at)
  VALUES ('user_seed_t005','miguel.torres@tc.co','Miguel','Torres','TUTOR','ACTIVE', NOW() - INTERVAL '40 days')
  RETURNING id INTO t5u;

  -- 2. Tutor profiles
  INSERT INTO tutors (clerk_id,email,nombre,apellido,descripcion,estado,rating,disponible,bio)
  VALUES ('user_seed_t001','carlos.mora@tc.co','Carlos','Mora','Tutor de matematicas con 5 anos de experiencia','VERIFICADO',4.8,true,'Ingeniero de sistemas, especialista en calculo y algebra.')
  RETURNING id INTO t1t;
  INSERT INTO tutors (clerk_id,email,nombre,apellido,descripcion,estado,rating,disponible,bio)
  VALUES ('user_seed_t002','sofia.reyes@tc.co','Sofia','Reyes','Experta en ciencias exactas','VERIFICADO',4.6,true,'Fisica con maestria, apasionada por la ensenanza.')
  RETURNING id INTO t2t;
  INSERT INTO tutors (clerk_id,email,nombre,apellido,descripcion,estado,rating,disponible,bio)
  VALUES ('user_seed_t003','andres.villa@tc.co','Andres','Villa','Programacion y bases de datos','VERIFICADO',4.5,true,'Desarrollador senior con experiencia docente.')
  RETURNING id INTO t3t;
  INSERT INTO tutors (clerk_id,email,nombre,apellido,descripcion,estado,rating,disponible,bio)
  VALUES ('user_seed_t004','laura.garcia@tc.co','Laura','Garcia','Quimica y biologia universitaria','VERIFICADO',4.7,true,'Quimica farmaceutica, docente universitaria.')
  RETURNING id INTO t4t;
  INSERT INTO tutors (clerk_id,email,nombre,apellido,descripcion,estado,rating,disponible,bio)
  VALUES ('user_seed_t005','miguel.torres@tc.co','Miguel','Torres','Ingles y comunicacion','VERIFICADO',4.3,true,'Licenciado en ingles, certificado C2.')
  RETURNING id INTO t5t;

  -- 3. Learners (25 estudiantes)
  l_ids := ARRAY[]::INT[];
  FOR i IN 1..25 LOOP
    INSERT INTO "user" (clerk_id,email,first_name,last_name,role,status,created_at)
    VALUES (
      'user_seed_l' || LPAD(i::TEXT,3,'0'),
      'learner' || i || '@students.co',
      (ARRAY['Juan','Maria','Pedro','Ana','Diego','Valentina','Camilo','Daniela','Sebastian','Luisa','Felipe','Carolina','David','Natalia','Nicolas','Isabela','Alejandro','Catalina','Mateo','Sara','Santiago','Paula','Julian','Veronica','Tomas'])[i],
      (ARRAY['Lopez','Martinez','Gonzalez','Rodriguez','Hernandez','Jimenez','Ramirez','Moreno','Alvarez','Romero','Torres','Navarro','Dominguez','Ramos','Gil','Serrano','Blanco','Molina','Castro','Ortiz','Rubio','Marin','Sanz','Iglesias','Nunez'])[i],
      'LEARNER','ACTIVE',
      NOW() - ((30 - i)::INT) * INTERVAL '1 day'
    ) RETURNING id INTO lid;
    l_ids := l_ids || lid;
  END LOOP;

  -- 4. Bookings + Payments + Reviews (30 dias, tendencia creciente)
  FOR d IN 0..29 LOOP
    FOR i IN 1..(3 + (d / 6)) LOOP
      bk_date := (NOW() - (29 - d) * INTERVAL '1 day')::DATE +
                  make_interval(hours => 8 + (i * 2 % 8));

      CASE (d * 5 + i) % 5
        WHEN 0 THEN bk_tutor_uid := t1u; bk_tutor_tid := t1t;
        WHEN 1 THEN bk_tutor_uid := t2u; bk_tutor_tid := t2t;
        WHEN 2 THEN bk_tutor_uid := t3u; bk_tutor_tid := t3t;
        WHEN 3 THEN bk_tutor_uid := t4u; bk_tutor_tid := t4t;
        ELSE        bk_tutor_uid := t5u; bk_tutor_tid := t5t;
      END CASE;

      lid := l_ids[((d + i) % 25) + 1];
      bk_subject := subjects[((d + i) % 10) + 1];
      bk_price := prices[((d * i) % 10) + 1];

      IF d < 22 THEN
        bk_status := 'completed';
      ELSE
        bk_status := statuses[((d + i) % 10) + 1];
      END IF;

      INSERT INTO bookings (student_id, tutor_id, "startTime", "endTime", status, subject, price, created_at, updated_at)
      VALUES (
        lid, bk_tutor_tid,
        bk_date, bk_date + INTERVAL '1 hour',
        bk_status, bk_subject, bk_price,
        bk_date, bk_date
      ) RETURNING id INTO bk_id;

      IF bk_status = 'completed' THEN
        INSERT INTO payment (booking_id, learner_id, amount, commission_rate, commission_amount, status, created_at, updated_at)
        VALUES (
          bk_id, lid,
          bk_price, 0.10,
          ROUND(bk_price * 0.10, 2),
          'COMPLETED',
          bk_date + INTERVAL '1 hour',
          bk_date + INTERVAL '1 hour'
        );

        IF (d + i) % 4 != 0 THEN
          INSERT INTO review (booking_id, learner_id, tutor_id, rating, comment, created_at, updated_at)
          VALUES (
            bk_id, lid, bk_tutor_uid,
            ratings[((d * 3 + i * 2) % 10) + 1],
            CASE ratings[((d * 3 + i * 2) % 10) + 1]
              WHEN 5 THEN 'Excelente tutor, explico muy bien el tema. Totalmente recomendado.'
              WHEN 4 THEN 'Muy buena sesion, quede satisfecho con la explicacion.'
              WHEN 3 THEN 'Buena sesion aunque algunos temas quedaron sin profundizar.'
              WHEN 2 THEN 'La sesion fue regular, esperaba mas detalle en los ejercicios.'
              ELSE 'No fue lo que esperaba, la explicacion no fue clara.'
            END,
            bk_date + INTERVAL '2 hours',
            bk_date + INTERVAL '2 hours'
          );
        END IF;
      END IF;

    END LOOP;
  END LOOP;

  RAISE NOTICE 'Seed completado exitosamente.';
END $$;
