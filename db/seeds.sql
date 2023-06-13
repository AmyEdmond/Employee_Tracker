INSERT INTO department (name)
VALUES ("HR"),
       ("Engineering"),
       ("Service"),
       ("Sales"),
       ("IT"),
       ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES 
    ('HR Director', 110000, 1),
    ("Software Engineer", 130000, 2),
    ("Customer service specialist", 40000, 3),
    ('Sales Associate', 60000, 4),
    ('Jr Developer', 85000, 5),
    ('Accountant', 115000, 6);



INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Jean", "Paul", 1),
       ("John", "Q", 2),
       ("Valerie", "Richard", 3),
       ("Kelly", "Knowles", 4),
       ("Darcy", "Lennon", 5),
        ("Maya", "Badou", 6);
       
